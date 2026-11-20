import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { previewConfig, verifyPreview } from '../scripts/verify-hosted-preview';
const env = { REDZEN_PREVIEW_URL:'https://redzen-suites-website-2026-ab1234-crzyhaxs.vercel.app',
  REDZEN_EXPECTED_PREVIEW_HOST:'redzen-suites-website-2026-ab1234-crzyhaxs.vercel.app',
  REDZEN_PREVIEW_TARGET_CONFIRMED:'true',REDZEN_PREVIEW_BYPASS_SECRET:'synthetic-contract-test-only' };
test('preview checks reject aliases, unrelated hosts and unconfirmed synthetic writes', () => {
  for (const patch of [{REDZEN_PREVIEW_URL:'http://redzen-suites-website-2026-ab1234-crzyhaxs.vercel.app'},
    {REDZEN_PREVIEW_URL:'https://redzen-suites-website-2026.vercel.app'},
    {REDZEN_PREVIEW_URL:'https://redzen-suites-wellness-ab1234-crzyhaxs.vercel.app'},
    {REDZEN_EXPECTED_PREVIEW_HOST:'other.example'}, {REDZEN_PREVIEW_TARGET_CONFIRMED:'false'},
    {REDZEN_PREVIEW_BYPASS_SECRET:''}]) assert.throws(() => previewConfig({...env,...patch},[]));
  assert.throws(() => previewConfig(env,['--synthetic']));
  assert.throws(() => previewConfig(env,['--synthetic','--confirm-host=other.example']));
});
test('closed preview contract makes no contact-data writes and refuses redirects or unprotected targets', async () => {
  const config=previewConfig(env,[]); const requests: {url:string; body:unknown}[]=[];
  const fake: typeof fetch = async (url, options) => {
    assert.equal(options?.redirect,'manual');
    requests.push({url:String(url),body:options?.body});
    const path=new URL(String(url)).pathname;
    if (!options?.headers?.['x-vercel-protection-bypass']) return new Response('',{status:401});
    if(path==='/') return new Response('<html></html>',{headers:{'Content-Type':'text/html'}});
    const status=path==='/api/health'?200:path==='/api/leads'?409:path==='/api/unknown'?404:503;
    return new Response(JSON.stringify({status:status===200?'ok':'unavailable',paymentReceived:false,reservationConfirmed:false}),
      {status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
  };
  const result=await verifyPreview(config,fake);
  assert.equal(result.checksPassed,7); assert.deepEqual(result.syntheticReferences,[]);
  assert.equal(requests.filter(r=>r.body).length,1); assert.equal(requests.find(r=>r.body)?.body,'{}');
  for(const status of [200,302]) await assert.rejects(verifyPreview(config,async()=>new Response('',{status})));
});
test('approved synthetic preview contract covers retries, conflicts, validation and both application kinds', async () => {
  const config=previewConfig(env,['--synthetic',`--confirm-host=${env.REDZEN_EXPECTED_PREVIEW_HOST}`]);
  const records=new Map<string,string>();
  const fake: typeof fetch = async (url,options) => {
    if(!options?.headers?.['x-vercel-protection-bypass']) return new Response('',{status:403});
    const path=new URL(String(url)).pathname;
    if(path==='/') return new Response('<html></html>',{headers:{'Content-Type':'text/html'}});
    let status=200; let result:Record<string,unknown>={status:'ok'};
    if(path==='/api/leads') {status=409;result={paymentReceived:false,reservationConfirmed:false};}
    else if(path==='/api/unknown') status=404;
    else if(path==='/api/ready') result={status:'ready'};
    else if(path==='/api/interest') {
      const data=JSON.parse(String(options.body)); const key=options.headers['Idempotency-Key'];
      if(options.headers['Origin']!==config.base) status=403;
      else if(!data.consent) status=400;
      else if(records.has(key)&&records.get(key)!==String(options.body)) status=409;
      else {records.set(key,String(options.body));status=201;result={id:createHash('sha256').update(key).digest('hex'),kind:data.kind,paymentReceived:false,reservationConfirmed:false};}
    }
    return new Response(JSON.stringify(result),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
  };
  const result=await verifyPreview(config,fake);
  assert.equal(result.checksPassed,19); assert.equal(records.size,2); assert.equal(result.syntheticReferences.length,2);
  assert.equal(result.databaseDurabilityAndBackupRestoreVerified,false);
});
