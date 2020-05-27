let vm = new Vue({
    el: "#site-container",
    delimiters: ["{$", "$}"],
    data: {
        currentPage: window.location.hash,
    },
    methods: {
        changePage: function(new_hash) {
            let currentPage = $(this.$refs[this.currentPage]);
            let nextPage = $(this.$refs[new_hash]);
            nextPage.css("display", "initial");
            currentPage.animate({left: "-100%"}, 500, function() {
                currentPage.css("left", 0);
            });
            nextPage.css("left", "100%");
            nextPage.animate({left: "0"}, 500, function() {
                vm.currentPage = new_hash;
            });
            window.location.hash = new_hash;
        },
        loadApi: function() {
            let children = this.$children;
            for (let i = 0; i < children.length; i++) {
                try {
                    children[i].getData()
                } catch {}
            }
        }
    },
})

$(window).on("hashchange", function(e) {
    vm.changePage("#" + e.originalEvent.newURL.split("#")[1]);
})
