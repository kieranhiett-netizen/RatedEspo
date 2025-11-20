<?php

namespace Espo\Custom\Controllers;

use Espo\Core\Controllers\Base;
use Espo\Core\Api\Request;
use Espo\Core\Api\Response;

class TestExternal extends Base
{
    public static $defaultAction = 'index';

    public function getActionAccount(Request $request, Response $response)
    {
        $id = $request->getRouteParam('id');

        if (!$id) {
            return ['rows' => []];
        }

        return $this->getService('TestExternal')->getAccountData($id);
    }
}
