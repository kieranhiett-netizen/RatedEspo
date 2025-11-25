{{#if hasRows}}
    <table class="table table-striped table-sm">
        <thead>
            <tr>
                {{#each firstRow}}
                    <th>{{@key}}</th>
                {{/each}}
            </tr>
        </thead>
        <tbody>
            {{#each rows}}
                <tr>
                    {{#each this}}
                        <td>{{this}}</td>
                    {{/each}}
                </tr>
            {{/each}}
        </tbody>
    </table>
{{else}}
    <div class="text-muted">No external data found.</div>
{{/if}}

