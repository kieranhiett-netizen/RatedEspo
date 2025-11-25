Espo.define('custom:views/account/panels/test-external', 'views/record/panel', function (Dep) {
    return Dep.extend({
        template: 'custom:account/panels/test-external',
        label: 'Test External',

        events: {
            'click .test-external-refresh': function (e) {
                e.preventDefault();
                this.fetchData();
            }
        },

        setup: function () {
            Dep.prototype.setup.call(this);

            this.rows = [];
            this.isLoading = false;
            this.error = null;

            this.listenTo(this.model, 'sync', function () {
                this.fetchData();
            });

            this.fetchData();
        },

        fetchData: function () {
            var self = this;
            var accountId = this.model && this.model.id;

            if (!accountId || this.isLoading) {
                if (!accountId) {
                    this.rows = [];
                    this.error = 'No Account ID found.';
                    this.render();
                }

                return;
            }

            this.isLoading = true;
            this.error = null;
            this.render();

            Espo.Ajax.getRequest('TestExternal/account-data', { id: accountId })
                .then(function (response) {
                    self.rows = response && response.rows ? response.rows : [];
                    self.error = null;
                })
                .catch(function () {
                    self.rows = [];
                    self.error = 'Failed to load external data.';
                })
                .then(function () {
                    self.isLoading = false;
                    self.render();
                });
        },

        data: function () {
            var rows = this.rows || [];
            var rowsForDisplay = rows.map(function (row) {
                var preview = row.data_json || '';

                if (preview && preview.length > 200) {
                    preview = preview.substring(0, 197) + '...';
                }

                return {
                    tradespersonId: row.tradesperson_id || '',
                    externalRef: row.external_ref || '',
                    createdAt: row.created_at || '',
                    updatedAt: row.updated_at || '',
                    dataPreview: preview
                };
            });

            return _.extend({}, Dep.prototype.data.call(this), {
                isLoading: this.isLoading,
                error: this.error,
                hasRows: rowsForDisplay.length > 0,
                rows: rowsForDisplay
            });
        }
    });
});
