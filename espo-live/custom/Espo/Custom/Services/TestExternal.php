<?php

namespace Espo\Custom\Services;

class TestExternal
{
    /**
     * Return external data for an Account.
     * For now just return an empty rows array so nothing breaks.
     */
    public function getAccountData(string $accountId): array
    {
        return [
            'rows' => [],
        ];
    }
}
