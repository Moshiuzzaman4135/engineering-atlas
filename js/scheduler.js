(function(){
  'use strict';
  const MIN=60*1000, HOUR=60*MIN, DAY=24*HOUR;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

  function rateCard(prev, rating, now, mode){
    const p=Object.assign({repetitions:0,intervalMs:0,ease:2.3,dueAt:now,lastRating:null}, prev||{});
    let interval, ease=p.ease, reps=p.repetitions;
    if(mode==='sprint'){
      const map={again:5*MIN, hard:30*MIN, good:4*HOUR, easy:16*HOUR};
      interval=map[rating] || map.good;
      if(rating==='again') reps=0; else reps+=1;
      ease=clamp(ease + ({again:-0.2,hard:-0.08,good:0.03,easy:0.12}[rating]||0),1.3,3.2);
    } else {
      if(rating==='again'){ interval=10*MIN; reps=0; ease=clamp(ease-0.2,1.3,3.2); }
      else if(rating==='hard'){ interval=p.intervalMs ? Math.max(12*HOUR,p.intervalMs*1.25) : 12*HOUR; reps+=1; ease=clamp(ease-0.08,1.3,3.2); }
      else if(rating==='easy'){ interval=p.intervalMs ? Math.max(4*DAY,p.intervalMs*2.7) : 4*DAY; reps+=1; ease=clamp(ease+0.12,1.3,3.2); }
      else { interval=p.intervalMs ? Math.max(2*DAY,p.intervalMs*2.2) : 2*DAY; reps+=1; ease=clamp(ease+0.03,1.3,3.2); }
    }
    interval=Math.round(interval);
    return Object.assign({},p,{repetitions:reps,intervalMs:interval,ease,dueAt:now+interval,lastReviewed:now,lastRating:rating});
  }

  function topicMastery(t){
    t=t||{};
    const v=(Number(t.lesson||0)*.20)+(Number(t.quiz||0)*.35)+(Number(t.cards||0)*.35)+(Number(t.explanation||0)*.10);
    return Math.round(clamp(v,0,1)*100);
  }

  function buildStudyQueue(data,state,now){
    state=state||{}; state.topics=state.topics||{}; state.cards=state.cards||{};
    const dueByTopic={};
    Object.keys(state.cards).forEach(id=>{
      const c=state.cards[id];
      if(c && c.topicId && (!c.dueAt || c.dueAt<=now)) dueByTopic[c.topicId]=(dueByTopic[c.topicId]||0)+1;
    });
    return (data.topics||[]).map(t=>{
      const st=state.topics[t.id]||{};
      const mastery=topicMastery(st);
      const ageDays=st.lastStudied ? Math.min(7,(now-st.lastStudied)/DAY) : 7;
      const due=dueByTopic[t.id]||0;
      const score=(t.priority||3)*18+(100-mastery)*.75+due*16+ageDays*3;
      return {id:t.id,title:t.title,domain:t.domain,priority:t.priority||3,mastery,dueCards:due,score:Math.round(score)};
    }).sort((a,b)=>b.score-a.score);
  }

  function domainMastery(data,state){
    const out={};
    (data.domains||[]).forEach(d=>out[d.id]={sum:0,count:0,value:0});
    (data.topics||[]).forEach(t=>{ if(!out[t.domain]) out[t.domain]={sum:0,count:0,value:0}; out[t.domain].sum+=topicMastery((state.topics||{})[t.id]); out[t.domain].count++; });
    Object.keys(out).forEach(k=>out[k].value=out[k].count?Math.round(out[k].sum/out[k].count):0);
    return out;
  }

  window.InterviewScheduler={rateCard,topicMastery,buildStudyQueue,domainMastery,constants:{MIN,HOUR,DAY}};
})();
