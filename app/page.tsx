import Studio from '../components/Studio';
import Landing from '../components/Landing';
export const dynamic='force-dynamic';
export default async function Home({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const params=await searchParams;return params.view?<Studio/>:<Landing/>;}
