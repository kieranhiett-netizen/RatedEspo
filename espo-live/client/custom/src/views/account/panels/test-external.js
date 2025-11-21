Espo.define('custom:views/account/panels/test-external', 'view', function (Dep) {

    return Dep.extend({

        template: 'custom:account/panels/test-external',

        // Optional: nice panel label (can also come from layout)
        label: 'Test External',

        setup: function () {
            Dep.prototype.setup.call(this);

            this.rows = [];
            this.isLoading = false;
            this.error = null;

            // Load data when the panel is created
            this.fetchData();

            // If the model is reloaded, refetch
            this.listenTo(this.model, 'sync', function () {
                this.fetchData();
            }, this);
        },

        fetchData: function () {
            var self = this;
            var id = this.model && this.model.id;
        
            console.log('TestExternal panel: fetchData called, id =', id);
        
            if (!id) {
                this.rows = [];
                this.error = 'No Account ID found.';
                this.render();
                return;
            }
        
            this.isLoading = true;
            this.error = null;
            this.render(); // show loading state
        
            Espo.Ajax.getRequest('testExternalAccount/' + id)
                .then(function (response) {
                    console.log('TestExternal panel: API response', response);
        
                    self.isLoading = false;
                    self.rows = (response && response.rows) ? response.rows : [];
                    self.error = null;
                    self.render();
                })
                .catch(function (xhr) {
                    console.log('TestExternal panel: API error', xhr);
        
                    self.isLoading = false;
                    self.rows = [];
                    self.error = 'Failed to load external data.';
                    self.render();
                });
        },
        

        render: function () {
            Dep.prototype.render.call(this);
        
            // Simple escape helper to avoid XSS and avoid relying on getHelper
            function esc(v) {
                if (v === null || v === undefined) {
                    return '';
                }
                return String(v)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            }
        
            var html = '';
        
            if (this.isLoading) {
                html = '<div class="text-muted">Loading external data…</div>';
            } else if (this.error) {
                html = '<div class="text-danger">' + esc(this.error) + '</div>';
            } else if (!this.rows || !this.rows.length) {
                html = '<div class="text-muted">No external data found for this account.</div>';
            } else {
                // Use the first row only
                var row = this.rows[0] || {};
        
                html += '<table class="table table-bordered table-sm">';
                html += '<tbody>';
        
                html += '<tr><th>Tradesperson ID</th><td>' +
                    esc(row.tradesperson_id) +
                    '</td></tr>';
        
                html += '<tr><th>Current Plan</th><td>' +
                    esc(row.current_plan_code) +
                    '</td></tr>';
        
                html += '<tr><th>Next Renewal</th><td>' +
                    esc(row.next_renewal_date) +
                    '</td></tr>';
        
                html += '<tr><th>Created At</th><td>' +
                    esc(row.created_at) +
                    '</td></tr>';
        
                html += '</tbody>';
                html += '</table>';
            }
        
            this.$el.html(html);
        }
    });
});
