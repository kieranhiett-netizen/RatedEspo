Espo.define('custom:views/account/panels/external-data', 'view', function (Dep) {

    return Dep.extend({

        template: 'custom:account/panels/external-data',

        endpoint: null,
        title: '',
        refreshLabel: 'Refresh',
        emptyText: 'No records found for this account.',
        columns: [],

        events: {
            'click [data-action="refresh"]': function (e) {
                e.preventDefault();
                if (!this.isLoading) {
                    this.fetchData();
                }
            }
        },

        setup: function () {
            Dep.prototype.setup.call(this);

            this.rows = [];
            this.isLoading = false;
            this.error = null;

            this.fetchData();
            this.listenTo(this.model, 'sync', this.fetchData, this);
        },

        data: function () {
            return {
                title: this.title,
                refreshLabel: this.refreshLabel
            };
        },

        render: function () {
            Dep.prototype.render.call(this);
            this.renderContent();
        },

        fetchData: function () {
            var id = this.model && this.model.id;

            if (!this.endpoint) {
                this.error = 'The endpoint is not configured.';
                this.renderContent();
                return;
            }

            if (!id) {
                this.rows = [];
                this.error = 'No Account selected.';
                this.renderContent();
                return;
            }

            this.isLoading = true;
            this.error = null;
            this.renderContent();

            Espo.Ajax.getRequest(this.endpoint + id)
                .then(function (response) {
                    this.rows = response && response.rows ? response.rows : [];
                    this.isLoading = false;
                    this.error = null;
                    this.renderContent();
                }.bind(this))
                .catch(function () {
                    this.rows = [];
                    this.isLoading = false;
                    this.error = this.translate('Error occurred', 'messages');
                    this.renderContent();
                }.bind(this));
        },

        renderContent: function () {
            if (!this.isRendered()) {
                return;
            }

            var $content = this.$('[data-role="content"]');

            var $button = this.$('[data-action="refresh"]');

            if (this.isLoading) {
                $button.prop('disabled', true).text('Refreshing...');
                $content.html('<div class="text-muted">Loading account data...</div>');
                return;
            }

            $button.prop('disabled', false).text(this.refreshLabel);

            if (this.error) {
                $content.html('<div class="text-danger">' + this.escapeString(this.error) + '</div>');
                return;
            }

            if (!this.rows.length) {
                $content.html('<div class="text-muted">' + this.escapeString(this.emptyText) + '</div>');
                return;
            }

            $content.html(this.buildTableHtml());
        },

        buildTableHtml: function () {
            var columns = this.columns || [];
            var html = '<div class="table-responsive"><table class="table table-bordered table-sm">' +
                '<thead><tr>';

            columns.forEach(function (column) {
                html += '<th>' + this.escapeString(column.label || column.name) + '</th>';
            }, this);

            html += '</tr></thead><tbody>';

            (this.rows || []).forEach(function (row) {
                html += '<tr>';

                columns.forEach(function (column) {
                    html += '<td>' + this.formatCell(row, column) + '</td>';
                }, this);

                html += '</tr>';
            }, this);

            html += '</tbody></table></div>';

            return html;
        },

        formatCell: function (row, column) {
            if (column.render) {
                return column.render.call(this, row, column);
            }

            var value = row[column.name];

            if (value === null || value === undefined) {
                return '';
            }

            if (column.type === 'currency') {
                return this.formatCurrencyValue(value, column.currencySymbol);
            }

            if (column.type === 'bool') {
                return this.escapeString(value ? this.translate('Yes') : this.translate('No'));
            }

            if (column.type === 'date') {
                return this.escapeString(this.getDateTime().toDisplayDate(value));
            }

            if (column.type === 'dateTime') {
                return this.escapeString(this.getDateTime().toDisplay(value));
            }

            return this.escapeString(value.toString());
        },

        formatCurrencyValue: function (value, symbol) {
            var number = parseFloat(value);

            if (isNaN(number)) {
                return this.escapeString(value.toString());
            }

            if (symbol) {
                return this.escapeString(symbol + number.toFixed(2));
            }

            var formatter = new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: this.getConfig().get('defaultCurrency') || 'GBP',
                currencyDisplay: 'symbol',
                minimumFractionDigits: 2
            });

            return this.escapeString(formatter.format(number));
        }
    });
});
