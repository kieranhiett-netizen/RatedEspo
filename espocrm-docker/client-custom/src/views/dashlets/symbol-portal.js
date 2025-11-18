define(['views/dashlets/abstract/base'], (BaseView) => {

    return class SymbolPortalDashlet extends BaseView {

        name = 'SymbolPortal';

        templateContent = `
            <div class="symbol-iframe-dashlet" style="height:100%;min-height:420px;">
                <iframe
                    src="https://symbol.ratedpeople.com/index.html"
                    style="border:0;width:100%;height:100%;"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        `;
    };
});
