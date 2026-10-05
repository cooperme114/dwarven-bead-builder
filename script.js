const state = {
  name: "",
  residence: "unknown",
  profession: "martial-education",
  rank: "common",
  life: "young",
  marriage: ["widowed"],
  children: ["deceased"],
  religion: "physical",
  crisis: ["search"],
  wealth: "debt",
  crimes: ["violent","economic"],
  houses: ["red","orange","yellow","green","blue","purple","pink"]
};

const definitions = {
  residence: {
    n:1, title:"Where do you live?", note:"Residence shard. White means the Dwarves have no recorded bead for that place; black means no fixed home.",
    shape:"shard", multiple:false,
    options:[
      ["elf","Elven lands","res-elf"],["orc","Orc marsh","res-orc"],["dwarf","Dwarven islands","res-dwarf"],
      ["gnome","Gnomish lands","res-gnome"],["tabaxi","Tabaxi volcanic lands","res-tabaxi"],
      ["unknown","Unknown / unrecorded","res-unknown"],["traveler","No fixed home","res-traveler"]
    ]
  },
  profession: {
    n:2, title:"What is your profession?", note:"Cube. Primary career function is the main color; secondary function is painted on two opposite faces.",
    shape:"cube", multiple:false,
    options:[
      ["none","No profession","prof-clear"],["martial-education","Martial + Education","prof-martial-education"],
      ["education-craft","Education + Craft","prof-education-craft"]
    ]
  },
  rank: {
    n:3, title:"What is your social standing?", note:"Metallic hexagon. This is standing in your own society, not wealth.",
    shape:"hex", multiple:false,
    options:[
      ["exiled","Exiled / disgraced","black-metal"],["low","Low standing","rose-gold"],["common","Common","copper"],
      ["respected","Respected","silver"],["authority","Nobility / authority","gold"],["ruling","Ruling family","platinum"]
    ]
  },
  life: {
    n:4, title:"What is your life stage?", note:"Diamond. Life stage is relative to your people, not chronological age.",
    shape:"diamond", multiple:false,
    options:[
      ["child","Child","life-child"],["adolescent","Adolescent","life-adolescent"],["young","Young adult","life-young"],
      ["mature","Established adult","life-mature"],["elder","Elder","life-elder"]
    ]
  },
  marriage: {
    n:5, title:"What is your marital status?", note:"Ring. Multiple current spouses may use multiple rings.",
    shape:"ring", multiple:true, max:8,
    options:[
      ["never","Never married","white"],["wife","Current spouse: woman","yellow"],["nb","Current spouse: nonbinary","orange"],
      ["husband","Current spouse: man","red"],["ended","Marriage legally ended","blue"],["widowed","Widowed","black"]
    ]
  },
  children: {
    n:6, title:"Do you have children?", note:"Small teardrops hang below the necklace. Add one bead per child; white is used only when there are none.",
    shape:"drop", multiple:true, max:30, hanging:true,
    options:[
      ["none","No children","white"],["daughter","Daughter","yellow"],["nb","Nonbinary child","orange"],["son","Son","red"],
      ["expected","Child on the way","pink"],["deceased","Deceased child","black"]
    ]
  },
  religion: {
    n:7, title:"Which Way do you follow?", note:"Striped barrel. Used in part so the Dwarves know what rites apply if you die under their hospitality.",
    shape:"barrel", multiple:false,
    options:[
      ["life","Way of Life","relig-life"],["elements","Way of Elements","relig-elements"],["physical","Way of the Physical","relig-physical"],
      ["philosophy","Way of Philosophy","relig-philosophy"],["information","Way of Information","relig-information"],["none","No Way","clear"]
    ]
  },
  crisis: {
    n:8, title:"How will you help in an emergency?", note:"Hourglass. Every non-child guest must volunteer for at least one crisis role.",
    shape:"hourglass", multiple:true, max:9,
    options:[
      ["child","Child / no assignment","clear"],["combat","Combat","red"],["evacuate","Evacuation","blue"],["medical","Medical","white"],
      ["service","Service / supplies","green"],["magic","Magic","purple"],["organize","Organize","pink"],["repair","Repair","orange"],
      ["care","Care for vulnerable people","yellow"],["search","Search / scout","black"]
    ]
  },
  wealth: {
    n:9, title:"What is your economic standing?", note:"Matte coin with a darker center.",
    shape:"coin", multiple:false,
    options:[
      ["dependent","Dependent","wealth-dependent"],["contrib","Household contributor","wealth-contrib"],["independent","Independent","wealth-independent"],
      ["head","Head of household","wealth-head"],["generational","Generational wealth","wealth-generational"],["debt","Legal debt / encumbered income","wealth-debt"]
    ]
  },
  crimes: {
    n:10, title:"What is your criminal standing?", note:"Thin heishi beads. Answers are given under Dwarven hospitality; multiple convictions may use multiple beads.",
    shape:"heishi", multiple:true, max:20,
    options:[
      ["none","No record","crime-none"],["pending","Pending trial","crime-pending"],["violent","Violent crime","crime-violent"],
      ["economic","Economic / property crime","crime-economic"],["order","Public-order crime","crime-order"]
    ]
  }
};

const houseDef = {
  title:"Dwarven House support", note:"These seven clear glass beads are permissions, not answers. A House may remove its own bead if it withdraws hospitality.",
  options:[["red","Red House","glass-red"],["orange","Orange House","glass-orange"],["yellow","Yellow House","glass-yellow"],["green","Green House","glass-green"],["blue","Blue House","glass-blue"],["purple","Purple House","glass-purple"],["pink","Pink House","glass-pink"]]
};

function optionData(def,key){ return def.options.find(o=>o[0]===key); }
function bead(shape, cls, extra=""){
  const el=document.createElement("span");
  el.className=`shape ${shape} ${cls} ${extra}`;
  return el;
}

function normalizeSpecials(key){
  if(key==="children"){
    const arr=state.children;
    if(arr.length>1 && arr.includes("none")) state.children=arr.filter(x=>x!=="none");
    if(state.children.length===0) state.children=["none"];
  }
  if(key==="crimes"){
    const arr=state.crimes;
    if(arr.length>1 && arr.includes("none")) state.crimes=arr.filter(x=>x!=="none");
    if(state.crimes.length===0) state.crimes=["none"];
  }
  if(key==="crisis"){
    if(state.life==="child") state.crisis=["child"];
    else {
      state.crisis=state.crisis.filter(x=>x!=="child");
      if(state.crisis.length===0) state.crisis=["service"];
    }
  }
}

function renderBuilder(){
  const root=document.querySelector("#builder");
  root.innerHTML="";
  Object.entries(definitions).forEach(([key,def])=>{
    const card=document.querySelector("#categoryTemplate").content.firstElementChild.cloneNode(true);
    card.dataset.key=key;
    card.querySelector(".question-number").textContent=`Question ${def.n}`;
    card.querySelector("h3").textContent=def.title;
    card.querySelector(".category-note").textContent=def.note;
    const current=card.querySelector(".current-bead");
    const values=Array.isArray(state[key])?state[key]:[state[key]];
    if(def.hanging){
      current.append(bead(def.shape,optionData(def,values[0])?.[2]||"white"));
    } else {
      values.slice(0,4).forEach(v=>{
        const d=optionData(def,v); if(d) current.append(bead(def.shape,d[2]));
      });
    }
    const list=card.querySelector(".option-list");
    def.options.forEach(([value,label,cls])=>{
      const b=document.createElement("button");
      b.className="option";
      const isSelected=values.includes(value);
      if(isSelected) b.classList.add("selected");
      const mini=bead(def.shape,cls,"mini"); b.append(mini);
      const t=document.createElement("span"); t.textContent=label; b.append(t);
      b.onclick=()=>{
        if(def.multiple){
          let arr=[...state[key]];
          if(key==="children" && value==="none"){ arr=["none"]; }
          else if(key==="crimes" && value==="none"){ arr=["none"]; }
          else if(key==="crisis" && value==="child"){ arr=["child"]; }
          else {
            if(arr.includes(value)) arr.splice(arr.indexOf(value),1);
            else if(arr.length<(def.max||20)) arr.push(value);
          }
          state[key]=arr;
        } else state[key]=value;
        normalizeSpecials(key);
        if(key==="life") normalizeSpecials("crisis");
        render();
      };
      list.append(b);
    });
    root.append(card);
  });

  const house=document.createElement("article");
  house.className="category-card house-panel";
  house.innerHTML=`<div class="category-top"><div><p class="question-number">Separate from the ten questions</p><h3>${houseDef.title}</h3><p class="category-note">${houseDef.note}</p></div></div><div class="option-list"></div>`;
  const list=house.querySelector(".option-list");
  houseDef.options.forEach(([value,label,cls])=>{
    const b=document.createElement("button"); b.className="option";
    if(state.houses.includes(value)) b.classList.add("selected");
    b.append(bead("sphere",cls,"mini"));
    const t=document.createElement("span"); t.textContent=label; b.append(t);
    b.onclick=()=>{
      const i=state.houses.indexOf(value);
      if(i>=0) state.houses.splice(i,1); else state.houses.push(value);
      render();
    };
    list.append(b);
  });
  root.append(house);
}

function addPreviewBead(container,key,value){
  const def=definitions[key], d=optionData(def,value); if(!d) return;
  const wrap=document.createElement("span"); wrap.className="bead-wrap";
  wrap.title=`${def.title} — ${d[1]}`;
  wrap.append(bead(def.shape,d[2],"preview-bead"));
  container.append(wrap);
}

function renderPreview(){
  const p=document.querySelector("#necklacePreview"); p.innerHTML="";
  // personal beads on the left
  ["residence","profession","rank","life","marriage"].forEach(key=>{
    const vals=Array.isArray(state[key])?state[key]:[state[key]];
    vals.forEach(v=>addPreviewBead(p,key,v));
  });
  // crimes + economic + religion + crisis on left side before center
  state.crimes.forEach(v=>addPreviewBead(p,"crimes",v));
  addPreviewBead(p,"wealth",state.wealth);
  addPreviewBead(p,"religion",state.religion);
  state.crisis.forEach(v=>addPreviewBead(p,"crisis",v));

  // house support center
  houseDef.options.filter(([v])=>state.houses.includes(v)).forEach(([v,,cls])=>{
    const wrap=document.createElement("span"); wrap.className="bead-wrap"; wrap.title=`${v} House supports this guest`;
    wrap.append(bead("sphere",cls,"preview-bead")); p.append(wrap);
  });

  // hanging children attached immediately after center
  const childAnchor=document.createElement("span"); childAnchor.className="bead-wrap";
  const stack=document.createElement("span"); stack.className="child-stack";
  state.children.forEach(v=>{
    const d=optionData(definitions.children,v); if(d) stack.append(bead("drop",d[2],"preview-bead"));
  });
  childAnchor.append(stack); p.append(childAnchor);
}

function render(){
  document.querySelector("#characterName").value=state.name;
  renderBuilder(); renderPreview();
}

document.querySelector("#characterName").addEventListener("input",e=>state.name=e.target.value);

document.querySelector("#resetAll").onclick=()=>{
  Object.assign(state,{
    name:"",residence:"unknown",profession:"none",rank:"common",life:"young",
    marriage:["never"],children:["none"],religion:"none",crisis:["service"],wealth:"independent",
    crimes:["none"],houses:["red","orange","yellow","green","blue","purple","pink"]
  });
  render();
};

document.querySelector("#loadAdessa").onclick=()=>{
  Object.assign(state,{
    name:"Adessa",residence:"unknown",profession:"martial-education",rank:"common",life:"young",
    marriage:["widowed"],children:["deceased"],religion:"physical",crisis:["search"],wealth:"debt",
    crimes:["violent","economic"],houses:["red","orange","yellow","green","blue","purple","pink"]
  });
  render();
};

render();