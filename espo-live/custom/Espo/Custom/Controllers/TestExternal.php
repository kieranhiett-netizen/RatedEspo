<?php

namespace Espo\Custom\Controllers;

use Espo\Core\Controllers\Base;

class TestExternal extends Base
{
    protected $defaultAction = 'index';

    public function getAccount($params, $data, $request)
    {
        $id = $params['id'] ?? null;

        if (!$id) {
            return ['rows' => []];
        }

        return $this->getService('TestExternal')->getAccountData($id);
    }
}

