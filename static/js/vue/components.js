let nb = Vue.component('nav-bar', {
    props: ["headers"],
    methods: {
        changeHash: function(new_hash) {
            this.$emit("change-page", window.location.origin + "/" + new_hash);
        },
        activateDropdown: function(title) {
            if (title in this.$refs) {
                let el = this.$refs[title][0];
                $(el).slideDown()
            }
        },
        deactivateDropdown: function(title) {
            if (title in this.$refs) {
                let el = this.$refs[title][0];
                $(el).slideUp()
            }
        }
    },
    computed: {
        headers_with_dropdown: function() {
            // returns headers that have dropdown: true
            return this.headers.filter(function(item) {
                return item.dropdown
            });
        },
    },
    template:
    `
        <div id='navbar'>
            <div id="navbar-option-container">
                <p
                    v-for='header in headers'
                    :key='header.id'
                    @click="changeHash(header.page)"
                    @mouseover="activateDropdown(header.text)"
                    @mouseout="deactivateDropdown(header.text)"
                >
                {{ header.text }}
                </p>
            </div>
            <div
                class="navbar-dropdown"
                v-for="dropdown in headers_with_dropdown"
                :ref="dropdown.text"
                :key="dropdown.id"
            >
            </div>
        </div>
    `,
});
