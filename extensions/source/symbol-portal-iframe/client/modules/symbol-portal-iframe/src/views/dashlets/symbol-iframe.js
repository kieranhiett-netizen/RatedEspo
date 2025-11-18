Espo.define('SymbolPortalIframe:views/dashlets/symbol-iframe', 'Dashlet', function (Dep) {

    return Dep.extend({

        template: 'SymbolPortalIframe:dashlets/symbol-iframe',

        // Default URL for the embedded app
        defaultOptions: {
            appUrl: 'https://symbol.ratedpeople.com/login.html'
        },

        setup: function () {
            Dep.prototype.setup.call(this);

            // Allow overriding via dashlet options later if needed
            this.appUrl = this.options.appUrl || this.defaultOptions.appUrl;
        }
    });
});
