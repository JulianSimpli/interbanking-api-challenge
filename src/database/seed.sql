-- Seed data for Interbanking API
-- Execute with: npm run db:seed

-- Insert mock companies
INSERT OR IGNORE INTO companies (id, cuit, name, adhesionDate, type) VALUES
('company-1', '20-12345678-9', 'TechCorp Solutions S.A.', '2025-01-15', 'CORPORATE'),
('company-2', '30-87654321-0', 'InnovateSoft Ltda.', '2025-02-20', 'PYME'),
('company-3', '20-11111111-1', 'GlobalTech Industries', '2025-03-10', 'CORPORATE'),
('company-4', '30-22222222-2', 'StartupHub S.A.', '2025-08-05', 'PYME'),
('company-5', '20-33333333-3', 'MegaCorp International', '2025-07-22', 'CORPORATE');

-- Insert mock transfers
INSERT OR IGNORE INTO transfers (id, companyId, debitAccount, creditAccount, amount, createdAt) VALUES
('transfer-1', 'company-1', '1234567890', '0987654321', 50000.00, '2025-08-01'),
('transfer-2', 'company-2', '1111111111', '2222222222', 25000.00, '2025-07-30'),
('transfer-3', 'company-1', '3333333333', '4444444444', 75000.00, '2025-07-25'),
('transfer-4', 'company-3', '5555555555', '6666666666', 15000.00, '2025-07-20'),
('transfer-5', 'company-4', '7777777777', '8888888888', 35000.00, '2025-07-15'),
('transfer-6', 'company-5', '9999999999', '0000000000', 100000.00, '2025-06-01'),
('transfer-7', 'company-2', '1212121212', '3434343434', 45000.00, '2025-05-20');

-- Show results
SELECT 'Companies inserted:' as info;
SELECT COUNT(*) as company_count FROM companies;

SELECT 'Transfers inserted:' as info;
SELECT COUNT(*) as transfer_count FROM transfers;
