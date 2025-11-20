<?php

namespace Espo\Custom\Controllers;

use Espo\Core\Controllers\Base;
use Espo\Core\Api\Request;
use Espo\Core\Api\Response;

class TestExternal extends Base
{
    // Needs to stay static to avoid the previous fatal error
    protected static $defaultAction = 'index';

    public function getActionAccount(Request $request, Response $response)
    {
        // :id from the route will come in as a route param
        $id = $request->getRouteParam('id');

        if (!$id) {
            return [
                'rows' => [],
            ];
        }

        // Re-use your existing service logic
        return $this->getService('TestExternal')->getAccountData($id);
    }
}
