define('custom:views/account/panels/test-external', ['view'], function (Dep) {
    return Dep.extend({
        template: 'custom:account/panels/test-external',

        setup: function () {
            Dep.prototype.setup.call(this);

            this.rows = [];

            this.loadData();
        },

        loadData: function () {
            var id = this.model ? this.model.id : null;
            var self = this;

            if (!id) {
                this.rows = [];
                this.reRender();

                return;
            }

            this.ajaxGetRequest('TestExternal/account/' + id)
                .then(function (data) {
                    self.rows = data && data.rows ? data.rows : [];
                    self.reRender();
                })
                .catch(function () {
                    self.rows = [];
                    self.reRender();
                });
        },

        data: function () {
            var rows = this.rows || [];

            return {
                rows: rows,
                hasRows: rows.length > 0,
                firstRow: rows.length ? rows[0] : null
            };
        }
    });
});

