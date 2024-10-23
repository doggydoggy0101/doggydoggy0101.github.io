// ---------- gsap ----------
CustomEase.create("cubic-bezier-blog", "0,.62,.4,1.22");
CustomEase.create("cubic-bezier-research", ".27,.63,.64,.9");

gsap.to(".blog-container", {
    scrollTrigger: {
        trigger: ".blog-container",
        start: "top 80%",
        end: "bottom 30%",
        scrub: false,
        toggleActions: "play reverse play reverse",
        // markers: true, // debug
    },
    x: 200, 
    duration: 0.6, 
    opacity: 1, 
    ease: "cubic-bezier-blog"
})


var researchs = gsap.utils.toArray('.research');
researchs.forEach((research) => {
    gsap.to(research, { 
            scrollTrigger: {
                trigger: research,
                start: "top 100%",
                end: "100px 100%",
                scrub: true,
                // markers: true, // debug
            },
            y: -60, 
            opacity: 1, 
            ease: "cubic-bezier-research",
    });
})
