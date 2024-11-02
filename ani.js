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

  const swiper1 = new Swiper('.swiper1', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  })
  
  swiper1.on('slideChange', function () {
  
    gsap.to(swiper2.slides[swiper2.activeIndex], {scale:1, opacity:1})
    gsap.to(swiper2.slides[swiper2.previousIndex], {opacity:0.3, scale:0.8})
    
  });

  const swiper2 = new Swiper('.swiper2', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  })
  
  swiper2.on('slideChange', function () {
  
    gsap.to(swiper2.slides[swiper2.activeIndex], {scale:1, opacity:1})
    gsap.to(swiper2.slides[swiper2.previousIndex], {opacity:0.3, scale:0.8})
    
  });

  const swiper3 = new Swiper('.swiper3', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  })
  
  swiper3.on('slideChange', function () {
  
    gsap.to(swiper3.slides[swiper3.activeIndex], {scale:1, opacity:1})
    gsap.to(swiper3.slides[swiper3.previousIndex], {opacity:0.3, scale:0.8})
    
  });

  const swiper4 = new Swiper('.swiper4', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  })
  
  swiper4.on('slideChange', function () {
  
    gsap.to(swiper4.slides[swiper4.activeIndex], {scale:1, opacity:1})
    gsap.to(swiper4.slides[swiper4.previousIndex], {opacity:0.3, scale:0.8})
    
  });
  const swiper5 = new Swiper('.swiper5', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  })
  
  swiper5.on('slideChange', function () {
  
    gsap.to(swiper5.slides[swiper5.activeIndex], {scale:1, opacity:1})
    gsap.to(swiper5.slides[swiper5.previousIndex], {opacity:0.3, scale:0.8})
    
  });




  window.onload=function(){ 
      const tlLoad = gsap.timeline({});
    tlLoad
          .set(".container-season" , { visibility: "visible" })
          .from("#logo-bg" , { opacity:0, y:30,duration: 2.5, ease: "power3.out" },"loading")
          .from("#logo" , { opacity:0,scale:6,y:100,duration: 2.5, ease: "power3.out" },.2,"loading")
          .from("#logo-title" , { opacity:0,scale:.5,y:100 ,duration: 2.5, ease: "power3.out"},.5,"loading")
          .from(".left-side" , { opacity:0,y:50 ,duration: 1.5, ease: "power3.out"},.9  ,"loading")
          .from(".right-side " , { opacity:0,y:50 ,duration: 1.5, ease: "power3.out"} ,.9 ,"loading")
          .from(".season-1-title .left-bar " , { opacity:0,x:-300,duration:.5 ,stagger:.3, ease: "power3.out"},1,"loading")
          .from(".season-1-title .right-bar " , { opacity:0,x:3000,duration:1,stagger:.3, ease: "power3.out"},1,"loading")
          .from(".season-1-title img" , { opacity:0,scale:.1,duration:1,stagger:.3, ease: "power3.out"},1,"loading")
          .from(".season-1-title h1" , { opacity:0,x:100,duration:1,stagger:.2, ease: "power3.out"},1,"loading")
          .from(".movies" , { opacity:0,y:100,duration:1, ease: "power3.out"},1,"loading")
  
          
  }


  gsap.registerPlugin(ScrollTrigger)
  const tl1 = gsap.timeline({delay:1});
  const seas2Pdescrabtion = SplitType.create('.season-2 .season-descrabtion');
  tl1.to(".container-season" , { backgroundColor:"#DB9A03", ease: "power3.out"},"season-2")
      .to(".cls-2" , { fill:"#CA8F00", ease: "power3.out"},"season-2")
      .from(".season-2 .season-2-title .left-bar " , { opacity:0,x:-300,duration:.5 ,stagger:.3, ease: "power3.out"},"season-2")
      .from(".season-2 .season-2-title .right-bar " , { opacity:0,x:3000,duration:1,stagger:.3, ease: "power3.out"},"season-2")
      .from(".season-2 .season-2-title img" , { opacity:0,scale:.1,duration:1,stagger:.3, ease: "power3.out"},"season-2")
      .from(".season-2 .season-2-title h1" , { opacity:0,x:100,duration:1,stagger:.2, ease: "power3.out"},"season-2")
      .from(seas2Pdescrabtion.lines , { opacity:0,y:20,stagger:.1, ease: "power2.out"},1,"season-2")
      .from(".movies2" , { opacity:0,y:100,duration:1, ease: "power3.out"},1,"season-2")


ScrollTrigger.defaults({
  toggleActions: "play complete restart reset",
  scroller: ".container-season"
});
ScrollTrigger.create({
trigger: ".season-2",
animation:tl1,
snap:.5,
});


const seas3Pdescrabtion = SplitType.create('.season-3 .season-descrabtion');
const tl2 = gsap.timeline({delay:1});
tl2.to(".container-season" , { backgroundColor:"#339605", ease: "power3.out"},"season-3")
    .to(".cls-2" , { fill:"#339900", ease: "power3.out"},"season-3")
        .from(".season-3-title .left-bar " , { opacity:0,x:-300,duration:.5 ,stagger:.3, ease: "power3.out"},"season-3")
        .from(".season-3-title .right-bar " , { opacity:0,x:3000,duration:1,stagger:.3, ease: "power3.out"},"season-3")
        .from(".season-3-title img" , { opacity:0,scale:.1,duration:1,stagger:.3, ease: "power3.out"},"season-3")
        .from(".season-3-title h1" , { opacity:0,x:100,duration:1,stagger:.2, ease: "power3.out"},"season-3")
        .from(seas3Pdescrabtion.lines , { opacity:0,y:20,stagger:.1, ease: "power2.out"},1,"season-3")
        .from(".movies3" , { opacity:0,y:100,duration:1, ease: "power3.out"},1,"season-3")
ScrollTrigger.create({
  trigger: ".season-3",

    animation:tl2,
  snap:.5,
  });


  const seas4Pdescrabtion = SplitType.create('.season-4 .season-descrabtion');
  const tl3  = gsap.timeline({delay:1});
  tl3.to(".container-season" , { backgroundColor:"#337DCB", ease: "power3.out"},"season-4")
      .to(".cls-2" , { fill:"#34669A", ease: "power3.out"},"season-4")
          .from(".season-4-title .left-bar " , { opacity:0,x:-300,duration:.5 ,stagger:.3, ease: "power3.out"},"season-4")
          .from(".season-4-title .right-bar " , { opacity:0,x:3000,duration:1,stagger:.3, ease: "power3.out"},"season-4")
          .from(".season-4-title img" , { opacity:0,scale:.1,duration:1,stagger:.3, ease: "power3.out"},"season-4")
          .from(".season-4-title h1" , { opacity:0,x:100,duration:1,stagger:.2, ease: "power3.out"},"season-4")
          .from(seas4Pdescrabtion.lines , { opacity:0,y:20,stagger:.1, ease: "power2.out"},1,"season-4")
          .from(".movies4" , { opacity:0,y:100,duration:1, ease: "power3.out"},1,"season-4")
  ScrollTrigger.create({
    trigger: ".season-4",
    animation:tl3,
    snap:.5,
    });

    const tl4 = gsap.timeline({delay:1});
    tl4.to(".container-season" , { backgroundColor:"#337DCB", ease: "power3.out"},"season-5")
        .to(".cls-2" , { fill:"#34669A", ease: "power3.out"},"season-5")
            .from(".season-5-title .left-bar " , { opacity:0,x:-300,duration:.5 ,stagger:.3, ease: "power3.out"},"season-5")
            .from(".season-5-title .right-bar " , { opacity:0,x:3000,duration:1,stagger:.3, ease: "power3.out"},"season-5")
            .from(".season-5-title img" , { opacity:0,scale:.1,duration:1,stagger:.3, ease: "power3.out"},"season-5")
            .from(".season-5-title h1" , { opacity:0,x:100,duration:1,stagger:.2, ease: "power3.out"},"season-5")
            .from(".director" , { opacity:0,y:100,duration:1, ease: "power3.out"},1,"season-5")
    ScrollTrigger.create({
      trigger: ".season-5",
      animation:tl4,
      snap:.5,
      });
  