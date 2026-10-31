import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {api} from '../../../lib/service';
export const dynamic='force-dynamic';
async function handle(request:Request){if(!env.DB)return Response.json({error:'The database is not connected. Please try again later.'},{status:503});return api(request,env.DB,await getChatGPTUser());}
export const GET=handle;
export const POST=handle;
export const PUT=handle;
export const DELETE=handle;
