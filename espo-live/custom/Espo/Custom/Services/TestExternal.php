<?php

namespace Espo\Custom\Services;

use Espo\Services\Base;

class TestExternal extends Base
{
    /**
     * Return external data for an Account.
     * For now just return an empty rows array so nothing breaks.
     */
    public function getAccountData(string $id): array
    {
        return [
            'rows' => [],
        ];
    }
}
