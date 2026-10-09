const RATE=4, CODE="5PNDPR2S", DOMAIN="@jdaipartnership.com";
const $=id=>document.getElementById(id);
let mem={users:{},cur:null}, view="home";
function load(){try{const r=localStorage.getItem("djai");if(r)mem=JSON.parse(r)}catch(e){}}
function save(){try{localStorage.setItem("djai",JSON.stringify(mem))}catch(e){}}
function slug(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function money(n){return "$"+n.toFixed(2)}
function user(){return mem.users[mem.cur]}
function today(){return new Date().toLocaleDateString("fr-FR")}
function esc(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function log(u,t){u.log.unshift({d:today(),t})}
function balance(u){return u.subs.filter(s=>s.status==="ok").reduce((a,s)=>a+s.min/60*RATE,0)}
function toast(t){$("toast").textContent=t;setTimeout(()=>{$("toast").textContent=""},3000)}

async function hash(t){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode("djai:"+t));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,"0")).join("")}
$("eye").onclick=()=>{const i=$("pw"),h=i.type==="password";i.type=h?"text":"password";$("eye").textContent=h?"Cacher":"Voir"};
$("refbtn").onclick=()=>$("refbox").classList.toggle("hide");
$("agree").onchange=()=>{$("signup").disabled=!$("agree").checked};
$("signup").onclick=async()=>{
  const fn=$("fn").value,ln=$("ln").value,pe=$("pe").value.trim(),pd=$("pd").value.trim(),pw=$("pw").value,e=$("err");
  if(!slug(fn)||!slug(ln)) return e.textContent="Entrez votre prénom et votre nom.";
  if(!/^\S+@\S+\.\S+$/.test(pe)) return e.textContent="Entrez un email valide.";
  if(pw.length<8) return e.textContent="Le mot de passe doit contenir au moins 8 caractères.";
  if(!pd) return e.textContent="Entrez les détails de votre paiement.";
  let mail=slug(fn)+DOMAIN;
  if(mem.users[mail]) mail=slug(fn)+"."+slug(ln)+DOMAIN;
  if(mem.users[mail]) return e.textContent="Ce compte existe déjà. Connectez-vous.";
  const u={first:fn.trim(),last:ln.trim(),personal:pe,pw:await hash(pw),referral:$("ref").value.trim(),active:false,method:$("pm").value,detail:pd,subs:[],pays:[],log:[]};
  log(u,"Compte créé : "+mail);
  mem.users[mail]=u;mem.cur=mail;view="home";save();e.textContent="";render();
};
$("login").onclick=async()=>{
  const m=$("le").value.trim().toLowerCase(),u=mem.users[m];
  if(!u||u.pw!==await hash($("lp").value)) return $("lerr").textContent="Adresse ou mot de passe incorrect.";
  mem.cur=m;view="home";save();$("lerr").textContent="";render();
};
$("logout").onclick=()=>{mem.cur=null;save();$("menu").classList.add("hide");render()};
$("av").onclick=()=>{const m=$("menu");m.classList.toggle("hide");$("av").setAttribute("aria-expanded",!m.classList.contains("hide"))};
$("tc").onclick=()=>{$("menu").classList.add("hide");toast(navigator.onLine?"Connexion active.":"Vous êtes hors ligne.")};
$("cc2").onclick=()=>{$("menu").classList.add("hide");toast("Cache d’envoi vidé.")};
document.addEventListener("click",e=>{
  const g=e.target.closest("[data-go]");
  if(g){view=g.dataset.go;$("menu").classList.add("hide");render();window.scrollTo(0,0)}
});
$("acbtn").onclick=()=>{
  if($("ac").value.trim().toUpperCase()!==CODE) return $("acerr").textContent="Code de compagnie invalide. Vérifiez le code reçu.";
  const u=user();u.active=true;log(u,"Compte activé avec le code de la compagnie");
  $("ac").value="";$("acerr").textContent="";save();render();toast("Compte activé.");
};
$("submit").onclick=()=>{
  if(!user().active) return $("serr").textContent="Activez votre compte avec le code de la compagnie sur l’Accueil.";
  const t=$("st").value.trim(),m=parseInt($("sm").value,10);
  if(!t||!(m>0)) return $("serr").textContent="Entrez un titre et une durée en minutes.";
  const u=user();
  u.subs.unshift({id:Date.now(),date:today(),title:t,min:m,status:"wait"});
  log(u,"Tâche soumise : "+t+" ("+m+" min)");
  $("st").value="";$("sm").value="";$("serr").textContent="";save();render();
};
$("payout").onclick=()=>{
  const u=user(),b=balance(u);
  if(b<=0) return $("perr").textContent="Aucun solde à retirer. Faites approuver des heures d’abord.";
  u.pays.unshift({date:today(),amt:b,method:u.method,status:"En traitement"});
  u.subs.forEach(s=>{if(s.status==="ok")s.status="paid"});
  log(u,"Paiement demandé : "+money(b)+" via "+u.method);
  $("perr").textContent="";save();render();
};
function approve(id){const u=user(),s=u.subs.find(x=>x.id===id);if(s){s.status="ok";log(u,"Tâche approuvée : "+s.title);save();render()}}

function render(){
  const u=mem.cur&&user();
  $("auth").classList.toggle("hide",!!u);
  $("app").classList.toggle("hide",!u);
  if(!u) return;
  ["home","projects","activity","earnings","profile","inbox"].forEach(v=>$("v-"+v).classList.toggle("hide",v!==view));
  document.querySelectorAll("nav [data-go]").forEach(b=>b.classList.toggle("on",b.dataset.go===view));
  $("actcard").classList.toggle("hide",u.active===true);
  $("av").textContent=u.first.charAt(0).toUpperCase();
  $("hello").textContent="Bienvenue, "+u.first+" "+u.last+" !";
  const hrs=st=>u.subs.filter(s=>st.includes(s.status)).reduce((a,s)=>a+s.min/60,0);
  const waitAmt=hrs(["wait"])*RATE;
  $("bal").textContent=money(balance(u));$("bal2").textContent=money(balance(u));
  $("est").textContent=money(waitAmt);
  $("pmh").textContent=u.method;$("pmv").textContent=u.method;
  $("hok").textContent=hrs(["ok","paid"]).toFixed(1)+" h";
  $("hwait").textContent=hrs(["wait"]).toFixed(1)+" h";
  const label={wait:["wait","En attente"],ok:["ok2","Approuvé"],paid:["ok2","Payé"]};
  $("subs").innerHTML=u.subs.map(s=>`<tr><td>${s.date}</td><td>${esc(s.title)}</td><td>${s.min} min</td><td>${money(s.min/60*RATE)}</td><td><span class="tag ${label[s.status][0]}">${label[s.status][1]}</span></td><td>${s.status==="wait"?`<button class="ghost sm" onclick="approve(${s.id})">Approuver</button>`:""}</td></tr>`).join("");
  $("nosubs").classList.toggle("hide",u.subs.length>0);
  $("pays").innerHTML=u.pays.map(p=>`<tr><td>${p.date}</td><td>${money(p.amt)}</td><td>${p.method}</td><td><span class="tag wait">${p.status}</span></td></tr>`).join("");
  $("nopays").classList.toggle("hide",u.pays.length>0);
  $("actlist").innerHTML=u.log.map(l=>`<p style="margin:0 0 10px"><span class="mute">${l.d}</span> · ${esc(l.t)}</p>`).join("");
  $("pn").textContent=u.first+" "+u.last;$("myemail").textContent=mem.cur;
  $("ppe").textContent=u.personal;$("ppm").textContent=u.method+" · USD";
}
load();render();
