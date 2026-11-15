const DB='mind-reader-knowledge',STORE='learned',VERSION=1;
export function validEntry(e){
 return !!e&&typeof e.name==='string'&&e.name.trim().length>0&&e.name.length<=100&&['people','characters','animals','places','objects'].includes(e.category)&&Array.isArray(e.yes)&&Array.isArray(e.no)&&e.yes.every(x=>typeof x==='string')&&e.no.every(x=>typeof x==='string')&&!e.yes.some(x=>e.no.includes(x));
}
export function openKnowledge(){
 return new Promise((resolve,reject)=>{
  if(!('indexedDB' in globalThis)){reject(Error('IndexedDB unavailable'));return}
  const r=indexedDB.open(DB,VERSION);
  r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:'id'})};
  r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
 });
}
async function operation(mode,fn){
 const db=await openKnowledge();
 try{return await new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE,mode),store=tx.objectStore(STORE);
  let result;const request=fn(store);request.onsuccess=()=>{result=request.result};
  tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
 })}finally{db.close()}
}
export const getLearned=()=>operation('readonly',s=>s.getAll());
export function saveLearned(entry){if(!validEntry(entry))return Promise.reject(Error('Invalid learned answer'));return operation('readwrite',s=>s.put(entry))}
export const deleteLearned=id=>operation('readwrite',s=>s.delete(id));
export async function replaceLearned(entries){
 if(!Array.isArray(entries)||entries.length>5000||!entries.every(validEntry)||new Set(entries.map(x=>x.id)).size!==entries.length)throw Error('Invalid learned data');
 const db=await openKnowledge();try{await new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE);store.clear();entries.forEach(e=>store.put(e));
  tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
 })}finally{db.close()}
}
