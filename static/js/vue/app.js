let vm = new Vue({
    el: "#page-container",
    delimiters: ["{$", "$}"],
    data: {
        currentPage: window.location.hash,
    },
    methods: {
        changePage: function(new_link) {
            window.location = new_link;
            this.currentPage = "#" + new_link.split("#")[1];
        }
    }
})
