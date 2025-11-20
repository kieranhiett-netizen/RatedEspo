<?php

namespace Espo\Custom\Controllers;

use Espo\Core\Api\Request;
use Espo\Core\Api\Response;
use Espo\Core\Exceptions\BadRequest;
use Espo\Custom\TestExternal\AccountService;

class TestExternal
{
    public function __construct(
        private AccountService $accountService,
    ) {}

    /**
     * GET /api/v1/TestExternal/account/{id}
     */
    public function getActionAccount(
        Request $request,
        Response $response,
        array $params
    ): void {
        $id = $params['id'] ?? null;

        if (!$id) {
            throw new BadRequest("Account ID is required.");
        }

        $data = $this->accountService->getAccountData($id);

        $response->writeBody($data);
    }
}
