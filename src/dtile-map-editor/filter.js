(() => {
    const filters = [];

    DTile.Filter = class DTileFilter {
        static register() {
            filters.push(new this());
        }

        static get allFilters() { return filters; }
    };
})();
