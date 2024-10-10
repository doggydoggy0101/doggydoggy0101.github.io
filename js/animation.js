// ---------- gsap ----------
CustomEase.create("cubic-bezier-blog", "0,.62,.4,1.22");
CustomEase.create("cubic-bezier-research", ".27,.63,.64,.9");

gsap.to(".blog", {
    scrollTrigger: {
        trigger: ".blog",
        start: "top 80%",
        end: "bottom 100%",
        scrub: false,
        toggleActions: "play reverse play reverse",
        // markers: true, // debug
    },
    x: 200, 
    duration: 0.8, 
    opacity: 1, 
    ease: "cubic-bezier-blog"
})


var researchs = gsap.utils.toArray('.research');
researchs.forEach((research) => {
    gsap.to(research, { 
            scrollTrigger: {
                trigger: research,
                start: "top 85%",
                end: "bottom 85%",
                scrub: true,
                // markers: true, // debug
            },
            y: -60, 
            opacity: 1, 
            ease: "cubic-bezier-research",
    });
})
