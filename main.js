

gsap.registerPlugin(ScrollTrigger)

 const mouseMoveBG = () => {
  const contaner =  document.getElementById("center");
  const logo =  document.getElementById("logo");
  const logoBG =  document.getElementById("logo-bg");
  const logoTitle =  document.getElementById("logo-title");




  contaner.addEventListener( "mousemove" , (e) => {
  
    let xAxis = (window.innerWidth / 2 - e.pageX) / 40;
    let yAxis = (window.innerHeight / 2 - e.pageY) / 40;
    
    logo.style.transform = `translateY(${yAxis}px) translateX(${xAxis}px)`;
    logoBG.style.transform = `translateY(${yAxis / 30 }px ) translateX(${xAxis / 30 }px)`;
  });
  

  contaner.addEventListener( "mouseenter" , (e) => {
    logo.style.transition = "none";
    logoBG.style.transition = "none";
  });
  contaner.addEventListener( "mouseleave" , (e) => {
    logo.style.transition = "all .5s ease";
    logo.style.transform = `translateY(0) translateX(0) `;
    logoBG.style.transition = "all .5s ease";
    logoBG.style.transform = `translateY(0) translateX(0) `;
  });

 }
 const Seasons = () => {
  const swiper = new Swiper('.swiper2', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  })
  
  swiper.on('slideChange', function () {
  
    swiper.slides.forEach((slide, index)=>{
      let tl = gsap.timeline({paused:true})
      tl.from(".slider-title", {y:100, opacity:0, ease: "power3.out"},"sliding")
        .from(".slider-year", {y:100, opacity:0, ease: "power3.out"},"-=0.5","sliding")
        .from(".slider-img", {y:100, opacity:0, ease: "power3.out"},"-=0.5","sliding")  
        .from(".slider-descrabtion", {opacity:0, yPercent:50, ease: "power3.out"}, "-=0.5","sliding")
        .from(".slider-date", {opacity:0, yPercent:50, ease: "power3.out"}, "-=0.5","sliding")
      slide.animation = tl
      
    })  
    
    swiper.slides[0].animation.play()
  });
}
const heroPs = SplitType.create('.headers-hero p')


window.onload=function(){ 
  const tlLoad = gsap.timeline({});
  tlLoad.set(".container" , { visibility: "visible" })
        .set(".container-season" , { visibility: "visible" })
        .from("#logo-bg" , { opacity:0, y:30,duration: 2.5, ease: "power3.out" },"loading")
        .from("#logo" , { opacity:0,scale:6,y:100,duration: 2.5, ease: "power3.out" },.2,"loading")
        .from("#logo-title" , { opacity:0,scale:.5,y:100 ,duration: 2.5, ease: "power3.out"},.5,"loading")
        
        .from(".left-side" , { opacity:0,y:50 ,duration: 1.5, ease: "power3.out"},.9  ,"loading")
        .from(".right-side " , { opacity:0,y:50 ,duration: 1.5, ease: "power3.out"} ,.9 ,"loading")
        .from(".scroll-icon" , { opacity:0,y:100 , ease: "power3.out"},.5,"loading")
        .from(".img-sec" , { opacity:0,scale:.7,y:100 ,duration: 2.5, ease: "power3.out"},1,"loading")
        .from(".headers-hero h1" , { opacity:0,y:50 ,duration: 1.5, ease: "power3.out"},1.5,"loading")
        .from(heroPs.lines , { opacity:0,y:50 ,duration: 1.5,stagger:.1, ease: "power3.out"},1.8,"loading")

        mouseMoveBG();

}

const tl1 = gsap.timeline({delay:.5});
const sec1Pvision = SplitType.create('.vision p');
const sec1Pmission = SplitType.create('.mission p');
const sec1Pobjectives = SplitType.create('.objectives p');
 tl1
 .to(".container" , { backgroundColor:"#DB9A03", ease: "power3.out"},"sec1")
 .to(".cls-2" , { fill:"#CA8F00", ease: "power3.out"},"sec1")
 .from(".sec1-title .left-bar " , { opacity:0,x:-300,duration:.5 ,stagger:.3, ease: "power3.out"},"sec1")
.from(".sec1-title .right-bar " , { opacity:0,x:3000,duration:1,stagger:.3, ease: "power3.out"},"sec1")
.from(".sec1-title img" , { opacity:0,scale:.1,duration:1,stagger:.3, ease: "power3.out"},"sec1")
.from(".sec1-title h1" , { opacity:0,y:100,duration:1,stagger:.2, ease: "power3.out"},"sec1")
.from(sec1Pvision.words , {  opacity:0,y:20,stagger:.1, ease: "power2.out"},"sec1")
.from(sec1Pmission.words , {  opacity:0,y:20,stagger:.1, ease: "power2.out"},"sec1")
.from(sec1Pobjectives.words , {  opacity:0,y:20,stagger:.1, ease: "power2.out"},"sec1")

    ScrollTrigger.defaults({
      
  toggleActions: "play complete restart reset",
      scroller: ".container"
    });
ScrollTrigger.create({
  trigger: ".sec1",
  animation:tl1,
  snap:.5,
});

const tl2 = gsap.timeline({delay:.5});
const sec1Pplan = SplitType.create('.plan p');


 tl2.to(".navbar" ,{ y:-300, ease: "power3.out"},"workshop-gallery")
 .to(".headers" ,{ y:-300, ease: "power3.out"},"workshop-gallery")
 .to(".container" , { backgroundColor:"#337DCB", ease: "power3.out"},"sec2")
.to(".cls-2" , { fill:"#3366CC", ease: "power3.out"},"sec2")
.from(".plan-title .left-bar " , { opacity:0,x:-300,duration:1.5 ,stagger:.3, ease: "power3.out"},"sec2")
 .from(".plan-title .right-bar " , { opacity:0,x:3000,duration:1,stagger:.3, ease: "power3.out"},"sec2")
 .from(".plan-title img" , { opacity:0,scale:.1,duration:2.5, ease: "power3.out"},"sec2")
 .from(".plan-title h1" , { opacity:0,y:100,duration:1, ease: "power3.out"},"sec2")
.from(sec1Pplan.lines , {  opacity:0,y:20,stagger:.3,duration:1, ease: "power2.out"},"sec2")
.from(".pargraph li" , {  opacity:0,y:20,stagger:.3,duration:1, ease: "power2.out"},"sec2")



ScrollTrigger.create({
  trigger: ".sec2",
  animation:tl2,
});

const tl3 = gsap.timeline({});

 tl3
    .fromTo(".wrapper-text" ,{  x:"50%" }, { x:"-200%"},"workshop-gallery")
    .fromTo(".workshop-gallery-1" ,{  x:"-100%" }, { x:"100%"},"workshop-gallery")
    .fromTo(".workshop-gallery-2" ,{  x:"200%" }, { x:"-100%"},"workshop-gallery")


ScrollTrigger.matchMedia({
  '(min-width:768px)':function(){
    ScrollTrigger.create({

  toggleActions: "play none none none",
      trigger: ".workshop-gallery",
      start: '10% center',
      scrub: 1,
      //pin: true,
      snap: 0,
      end: "1000",
      animation:tl3,
    });

  },
  '(max-width:595px)':function(){
    
    ScrollTrigger.create({
      trigger: ".workshop-gallery",
      start: '20% center',
      scrub: 1,
      //pin: true,
      snap: 0,
      end: "500",
      animation:tl3,
    });
    
  }
})
const tl4 = gsap.timeline({});
const sec1Pstatement = SplitType.create('.statement p');
const sec1Pvalue = SplitType.create('.value p');

 tl4
 .to(".container" , { backgroundColor:"#339605", ease: "power3.out"},"sec4")
 .to(".cls-2" , { fill:"#339900", ease: "power3.out"},"sec4")
 .to(".navbar" ,{ y:0, ease: "power3.out",duration:1},.1,"sec4")
 .to(".headers" ,{ y:0, ease: "power3.out",duration:1},.1,"sec4")
 .from(".statement-title .left-bar " , { opacity:0,x:-300,duration:1.5 ,stagger:.3, ease: "power3.out"},"sec4")
 .from(".value-title .left-bar " , { opacity:0,x:-300,duration:1.5 ,stagger:.3, ease: "power3.out"},"sec4")
 .from(".statement-title .right-bar " , { opacity:0,x:3000,duration:1,stagger:.3, ease: "power3.out"},"sec4")
 .from(".value-title .right-bar " , { opacity:0,x:3000,duration:1,stagger:.3, ease: "power3.out"},"sec4")
 .from(".statement-title img" , { opacity:0,scale:.1,duration:2.5, ease: "power3.out"},"sec4")
 .from(".value-title img" , { opacity:0,scale:.1,duration:2.5, ease: "power3.out"},"sec4")
 .from(".statement-title h1" , { opacity:0,y:100,duration:1, ease: "power3.out"},"sec4")
 .from(".value-title h1" , { opacity:0,y:100,duration:1, ease: "power3.out"},"sec4")
.from(sec1Pstatement.lines , {  opacity:0,y:20,stagger:.3,duration:1, ease: "power2.out"},"sec4") 
.from(sec1Pvalue.lines , {  opacity:0,y:20,stagger:.3,duration:1, ease: "power2.out"},"sec4") 



ScrollTrigger.create({
  trigger: ".sec4",
  animation:tl4,
  snap:.5,
});

const tl5 = gsap.timeline({});
const sec1Phistorical = SplitType.create('.historical-background p');


 tl5.to(".container" , { backgroundColor:"#C54501", ease: "power3.out"},"footer")
 .to(".cls-2" , { fill:"#b73f01", ease: "power3.out"},"footer")
 .from(".historical-title .left-bar " , { opacity:0,x:-300,duration:1.5 ,stagger:.3, ease: "power3.out"},"footer")
 .from(".historical-title .right-bar " , { opacity:0,x:3000,duration:1,stagger:.3, ease: "power3.out"},"footer")
 .from(".historical-title img" , { opacity:0,scale:.1,duration:2.5, ease: "power3.out"},"footer")
 .from(".historical-title h1" , { opacity:0,y:100,duration:1, ease: "power3.out"},"footer")
.from(sec1Phistorical.lines , {  opacity:0,y:20,stagger:.3,duration:1, ease: "power2.out"},"footer")




ScrollTrigger.create({
  trigger: ".footer",
  animation:tl5,
  snap:.5,
});