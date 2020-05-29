// remove wait screen on document load
$(function() {
    if (window.location.hash === "") {
        window.location.hash = "#home";
    };
    vm.loadApi();
    vm.$refs["project-cards"].projectsdata = vm.$refs["project-cards"].projectsdataprop;
    $("#wait-screen").remove();
})
