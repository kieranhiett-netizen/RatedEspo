<?php

namespace Espo\Custom\TestExternal;

use Espo\ORM\EntityManager;
use Espo\Core\Exceptions\NotFound;

class AccountService
{
    public function __construct(
        private EntityManager $entityManager,
    ) {}

    /**
     * Return external data for an Account.
     * For now this just returns a stub structure so we can prove the wiring.
     * We will plug in the real test_external table next.
     */
    public function getAccountData(string $accountId): array
    {
        // Load the Account entity
        $account = $this->entityManager->getEntityById('Account', $accountId);

        if (!$account) {
            throw new NotFound("Account not found.");
        }

        $userId = $account->get('cUserId');

        if (!$userId) {
            // No external user id ⇒ no rows
            return [
                'rows' => [],
            ];
        }

        // STUB: just return some dummy data so we can see it working
        return [
            'rows' => [
                [
                    'tradesperson_id' => $userId,
                    'source'          => 'stub',
                    'note'            => 'Service wiring OK, DB query to come next.',
                ],
            ],
        ];
    }
}
