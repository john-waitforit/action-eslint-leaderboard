export const isNilDiff = `diff --git a/libeo/src/common/class-validator/is-total-greater-than-total-wot.ts b/libeo/src/common/class-validator/is-total-greater-than-total-wot.ts
index 5529d38001..2c7f9c6d91 100644
--- a/libeo/src/common/class-validator/is-total-greater-than-total-wot.ts
+++ b/libeo/src/common/class-validator/is-total-greater-than-total-wot.ts
@@ -1,3 +1,4 @@
+import { isNil } from "@libeo/utils";
 import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
 
 type ObjectWithTotalWoTConstraint = unknown & { totalWithoutTax: number | null };
@@ -7,8 +8,7 @@ class IsTotalGreaterThanTotalWoTConstraint implements ValidatorConstraintInterfa
   validate(total: number | null, args: ValidationArguments): boolean {
     const objectWithTotalWot = args.object as ObjectWithTotalWoTConstraint;
     const { totalWithoutTax } = objectWithTotalWot;
-    // eslint-disable-next-line eqeqeq, eqeqeq
-    if (total == null || totalWithoutTax == null) {
+    if (isNil(total) || isNil(totalWithoutTax)) {
       return true;
     }
     return total >= totalWithoutTax;
diff --git a/libeo/src/common/value-transformer/convert-in-number.value-transformer.ts b/libeo/src/common/value-transformer/convert-in-number.value-transformer.ts
index 2993ee4530..375318a2f9 100644
--- a/libeo/src/common/value-transformer/convert-in-number.value-transformer.ts
+++ b/libeo/src/common/value-transformer/convert-in-number.value-transformer.ts
@@ -1,3 +1,4 @@
+import { isNil } from "@libeo/utils";
 import { ValueTransformer } from "typeorm";
 
 export const convertInNumber: ValueTransformer = {
@@ -8,8 +9,7 @@ export const convertInNumber: ValueTransformer = {
     return entityValue;
   },
   from: (databaseValue: number | null | undefined): string | null | undefined => {
-    // eslint-disable-next-line eqeqeq
-    if (databaseValue == null) {
+    if (isNil(databaseValue)) {
       return databaseValue;
     }
     return databaseValue.toString();
diff --git a/libeo/src/documents-to-control/core/application/sagas/helpers/scanned-document-to-credit-note.mapper.ts b/libeo/src/documents-to-control/core/application/sagas/helpers/scanned-document-to-credit-note.mapper.ts
index d0a9a305d7..01059309fd 100644
--- a/libeo/src/documents-to-control/core/application/sagas/helpers/scanned-document-to-credit-note.mapper.ts
+++ b/libeo/src/documents-to-control/core/application/sagas/helpers/scanned-document-to-credit-note.mapper.ts
@@ -1,4 +1,4 @@
-import { findCurrencyCodeFromCurrency } from "@libeo/utils";
+import { findCurrencyCodeFromCurrency, isNil } from "@libeo/utils";
 import { CreditNoteEntity } from "../../../../../credit-note/core/domain/credit-note/credit-note.entity";
 import { AmountValue } from "../../../../../helpers/amount/amount-value";
 import { ScannedCreditNoteDocument } from "../../../domain/scanned-document/scanned-credit-note-document.object-value";
@@ -9,8 +9,7 @@ export const scannedDocumentToPartialCreditNote = (
   return {
     id: scannedDocument.creditNoteId,
     currency: findCurrencyCodeFromCurrency(scannedDocument.ocrCurrency),
-    // eslint-disable-next-line eqeqeq
-    total: scannedDocument.ocrTotal != null ? AmountValue.fromNumber(scannedDocument.ocrTotal) : null,
+    total: !isNil(scannedDocument.ocrTotal) ? AmountValue.fromNumber(scannedDocument.ocrTotal) : null,
     totalWoT: scannedDocument.ocrTotalWoT,
     creditNoteDate: scannedDocument.ocrDocumentDate,
     customNumber: scannedDocument.ocrCustomDocumentNumber,
diff --git a/libeo/src/documents-to-control/core/application/sagas/helpers/scanned-document-to-invoice.mapper.ts b/libeo/src/documents-to-control/core/application/sagas/helpers/scanned-document-to-invoice.mapper.ts
index e767a48f85..af9f7eec5d 100644
--- a/libeo/src/documents-to-control/core/application/sagas/helpers/scanned-document-to-invoice.mapper.ts
+++ b/libeo/src/documents-to-control/core/application/sagas/helpers/scanned-document-to-invoice.mapper.ts
@@ -1,4 +1,4 @@
-import { CUSTOM_INVOICE_NUMBER_MAX_LENGTH, findCurrencyCodeFromCurrency } from "@libeo/utils";
+import { CUSTOM_INVOICE_NUMBER_MAX_LENGTH, findCurrencyCodeFromCurrency, isNil } from "@libeo/utils";
 import { AmountValue } from "../../../../../helpers/amount/amount-value";
 import { Invoice } from "../../../../../invoice/invoice.entity";
 import { ScannedInvoiceDocument } from "../../../domain/scanned-document/scanned-invoice-document.object-value";
@@ -13,8 +13,7 @@ export const scannedDocumentToPartialInvoice = (scannedDocument: ScannedInvoiceD
     filepath: scannedDocument.fileLocation,
     filename: scannedDocument.filename,
     currency: findCurrencyCodeFromCurrency(scannedDocument.ocrCurrency),
-    // eslint-disable-next-line eqeqeq
-    total: scannedDocument.ocrTotal != null ? AmountValue.fromNumber(scannedDocument.ocrTotal) : null,
+    total: !isNil(scannedDocument.ocrTotal) ? AmountValue.fromNumber(scannedDocument.ocrTotal) : null,
     totalWoT: scannedDocument.ocrTotalWoT,
     vatAmounts: scannedDocument.ocrVatAmounts,
     invoiceDate: scannedDocument.ocrDocumentDate,
diff --git a/libeo/src/documents-to-control/core/domain/scanned-document/scanned-credit-note-document.object-value.ts b/libeo/src/documents-to-control/core/domain/scanned-document/scanned-credit-note-document.object-value.ts
index 8173a611df..7cee9f3427 100644
--- a/libeo/src/documents-to-control/core/domain/scanned-document/scanned-credit-note-document.object-value.ts
+++ b/libeo/src/documents-to-control/core/domain/scanned-document/scanned-credit-note-document.object-value.ts
@@ -1,3 +1,4 @@
+import { isNil } from "@libeo/utils";
 import { ScannedDocument, ScannedDocumentType } from "./scanned-document.entity";
 
 export type ScannedCreditNoteDocument = ScannedDocument & {
@@ -6,6 +7,5 @@ export type ScannedCreditNoteDocument = ScannedDocument & {
 };
 
 export const isScannedCreditNoteDocument = (scannedDocument: ScannedDocument): scannedDocument is ScannedCreditNoteDocument => {
-  // eslint-disable-next-line eqeqeq
-  return scannedDocument.creditNoteId != null;
+  return !isNil(scannedDocument.creditNoteId);
 };
diff --git a/libeo/src/documents-to-control/core/domain/scanned-document/scanned-invoice-document.object-value.ts b/libeo/src/documents-to-control/core/domain/scanned-document/scanned-invoice-document.object-value.ts
index b72f1a79f8..490f1338bc 100644
--- a/libeo/src/documents-to-control/core/domain/scanned-document/scanned-invoice-document.object-value.ts
+++ b/libeo/src/documents-to-control/core/domain/scanned-document/scanned-invoice-document.object-value.ts
@@ -1,3 +1,4 @@
+import { isNil } from "@libeo/utils";
 import { ScannedDocument, ScannedDocumentType } from "./scanned-document.entity";
 
 export type ScannedInvoiceDocument = ScannedDocument & {
@@ -6,6 +7,5 @@ export type ScannedInvoiceDocument = ScannedDocument & {
 };
 
 export const isScannedInvoiceDocument = (scannedDocument: ScannedDocument): scannedDocument is ScannedInvoiceDocument => {
-  // eslint-disable-next-line eqeqeq
-  return scannedDocument.invoiceId != null;
+  return !isNil(scannedDocument.invoiceId);
 };
diff --git a/libeo/src/documents-to-control/core/domain/scanned-document/scanned-invoice-receivable-document.object-value.ts b/libeo/src/documents-to-control/core/domain/scanned-document/scanned-invoice-receivable-document.object-value.ts
index 44894c00eb..3b82807531 100644
--- a/libeo/src/documents-to-control/core/domain/scanned-document/scanned-invoice-receivable-document.object-value.ts
+++ b/libeo/src/documents-to-control/core/domain/scanned-document/scanned-invoice-receivable-document.object-value.ts
@@ -1,3 +1,4 @@
+import { isNil } from "@libeo/utils";
 import { ScannedDocument, ScannedDocumentType } from "./scanned-document.entity";
 
 export type ScannedInvoiceReceivableDocument = ScannedDocument & {
@@ -6,6 +7,5 @@ export type ScannedInvoiceReceivableDocument = ScannedDocument & {
 };
 
 export const isScannedInvoiceReceivableDocument = (scannedDocument: ScannedDocument): scannedDocument is ScannedInvoiceReceivableDocument => {
-  // eslint-disable-next-line eqeqeq
-  return scannedDocument.invoiceReceivableId != null;
+  return !isNil(scannedDocument.invoiceReceivableId);
 };
diff --git a/libeo/src/documents-to-control/core/domain/scanned-document/scanned-purchase-order-document.object-value.ts b/libeo/src/documents-to-control/core/domain/scanned-document/scanned-purchase-order-document.object-value.ts
index 5728677c88..06689d2c82 100644
--- a/libeo/src/documents-to-control/core/domain/scanned-document/scanned-purchase-order-document.object-value.ts
+++ b/libeo/src/documents-to-control/core/domain/scanned-document/scanned-purchase-order-document.object-value.ts
@@ -1,3 +1,4 @@
+import { isNil } from "@libeo/utils";
 import { ScannedDocument, ScannedDocumentType } from "./scanned-document.entity";
 
 export type ScannedPurchaseOrderDocument = ScannedDocument & {
@@ -6,6 +7,5 @@ export type ScannedPurchaseOrderDocument = ScannedDocument & {
 };
 
 export const isScannedPurchaseOrderDocument = (scannedDocument: ScannedDocument): scannedDocument is ScannedPurchaseOrderDocument => {
-  // eslint-disable-next-line eqeqeq
-  return scannedDocument.purchaseOrderId != null;
+  return !isNil(scannedDocument.purchaseOrderId);
 };
diff --git a/libeo/src/history/history.repository.ts b/libeo/src/history/history.repository.ts
index 3b718775f7..1814376c87 100644
--- a/libeo/src/history/history.repository.ts
+++ b/libeo/src/history/history.repository.ts
@@ -1,3 +1,4 @@
+import { isNil } from "@libeo/utils";
 import { EntityRepository, Repository } from "typeorm";
 import { Invoice } from "../invoice/invoice.entity";
 import { History, HistoryEntity, HistoryEvent } from "./history.entity";
@@ -8,8 +9,7 @@ export interface HistoryWithUser extends History {
 }
 
 export const isHistoryWithUser = (history: History): history is HistoryWithUser => {
-  // eslint-disable-next-line eqeqeq
-  return history.user != null;
+  return !isNil(history.user);
 };
 
 @EntityRepository(History)
diff --git a/libeo/src/receivables/core/domain/types.ts b/libeo/src/receivables/core/domain/types.ts
index 5b93490d2b..55dbf12eaf 100644
--- a/libeo/src/receivables/core/domain/types.ts
+++ b/libeo/src/receivables/core/domain/types.ts
@@ -1,4 +1,4 @@
-import { CurrencyInformation } from "@libeo/utils";
+import { CurrencyInformation, isNil } from "@libeo/utils";
 import { Company } from "../../../company/core/domain/company/company.entity";
 import { AmountValue } from "../../../helpers/amount/amount-value";
 import { Organisation } from "../../../organisation/core/domain/organisation/organisation.entity";
@@ -97,43 +97,35 @@ export function assertReceivableInvoiceIsControllable(
 }
 
 export function assertInvoiceReceivableIsPayable(invoice: Partial<InvoiceReceivableEntity>): asserts invoice is PayableInvoiceReceivable {
-  // eslint-disable-next-line eqeqeq
-  if (invoice.totalAmount == null) {
+  if (isNil(invoice.totalAmount)) {
     throw new TypeError(\`Invoice receivable has no total\`);
   }
 
-  // eslint-disable-next-line eqeqeq
-  if (invoice.currency == null) {
+  if (isNil(invoice.currency)) {
     throw new TypeError(\`Invoice receivable has no currency\`);
   }
 
-  // eslint-disable-next-line eqeqeq
-  if (invoice.issueDate == null) {
+  if (isNil(invoice.issueDate)) {
     throw new TypeError(\`Invoice receivable has no issue date\`);
   }
 
-  // eslint-disable-next-line eqeqeq
-  if (invoice.customerId == null) {
+  if (isNil(invoice.customerId)) {
     throw new TypeError(\`Invoice receivable has no customer\`);
   }
 
-  // eslint-disable-next-line eqeqeq
-  if (invoice.dueDate == null) {
+  if (isNil(invoice.dueDate)) {
     throw new TypeError(\`Invoice receivable has no due Date\`);
   }
 
-  // eslint-disable-next-line eqeqeq
-  if (invoice.customInvoiceNumber == null) {
+  if (isNil(invoice.customInvoiceNumber)) {
     throw new TypeError(\`Invoice receivable has no custom Invoice Number\`);
   }
 
-  // eslint-disable-next-line eqeqeq
-  if (invoice.currentBalance == null) {
+  if (isNil(invoice.currentBalance)) {
     throw new TypeError(\`Invoice receivable has no current balance\`);
   }
 
-  // eslint-disable-next-line eqeqeq
-  if (invoice.pendingBalance == null) {
+  if (isNil(invoice.pendingBalance)) {
     throw new TypeError(\`Invoice receivable has no pending balance\`);
   }
 }
@@ -141,8 +133,7 @@ export function assertInvoiceReceivableIsPayable(invoice: Partial<InvoiceReceiva
 export const isControlledInvoiceReceivableWithCustomer = (
   invoiceReceivableWithCustomer: InvoiceReceivableWithCustomer,
 ): invoiceReceivableWithCustomer is ControlledInvoiceReceivableWithCustomer => {
-  // eslint-disable-next-line eqeqeq
-  if (invoiceReceivableWithCustomer.totalAmount == null) {
+  if (isNil(invoiceReceivableWithCustomer.totalAmount)) {
     return false;
   }
   if (!invoiceReceivableWithCustomer.currency) {
diff --git a/libeo/src/user-extensions/fintecture/fintecture-inbound/fintecture-payment/fintecture-payment.service.ts b/libeo/src/user-extensions/fintecture/fintecture-inbound/fintecture-payment/fintecture-payment.service.ts
index 92acbc593a..d1e9f771bc 100644
--- a/libeo/src/user-extensions/fintecture/fintecture-inbound/fintecture-payment/fintecture-payment.service.ts
+++ b/libeo/src/user-extensions/fintecture/fintecture-inbound/fintecture-payment/fintecture-payment.service.ts
@@ -1,4 +1,4 @@
-import { PaymentStrategy, todayInDateWithoutTime } from "@libeo/utils";
+import { isNil, PaymentStrategy, todayInDateWithoutTime } from "@libeo/utils";
 import { Injectable, Logger } from "@nestjs/common";
 import { AmountValue } from "../../../../helpers/amount/amount-value";
 import { HistoryService } from "../../../../history/history.service";
@@ -97,8 +97,7 @@ export class FintecturePaymentService {
       const invoice = await this.invoiceRepository.findByOrganisationIdWithPaymentRequestsAndCreditNotesOrFail(organisationId, invoiceId);
       const role = await this.roleRepository.findOneOrFailByUserIdAndOrganisationId(organisationId, userId);
       const balance = InvoiceBalanceAndStatusService.computeInvoicePendingBalance(invoice);
-      // eslint-disable-next-line eqeqeq
-      if (balance == null || amount > balance) {
+      if (isNil(balance) || amount > balance) {
         this.logger.error(\`Fintecture payment created but amount and balance dont match for invoice \${invoiceId}\`);
       }
       const paymentDestinationId = await this.paymentDestinationService.findDefaultPaymentDestinationOrCreateIbanRequestAndPaymentDestination(
diff --git a/libeo/src/user-extensions/fintecture/fintecture-inbound/utils/getCannotPayInvoiceReceivableWithFintectureReason.ts b/libeo/src/user-extensions/fintecture/fintecture-inbound/utils/getCannotPayInvoiceReceivableWithFintectureReason.ts
index 2405014a37..c77424a76f 100644
--- a/libeo/src/user-extensions/fintecture/fintecture-inbound/utils/getCannotPayInvoiceReceivableWithFintectureReason.ts
+++ b/libeo/src/user-extensions/fintecture/fintecture-inbound/utils/getCannotPayInvoiceReceivableWithFintectureReason.ts
@@ -1,4 +1,4 @@
-import { CurrencyCode } from "@libeo/utils";
+import { CurrencyCode, isNil } from "@libeo/utils";
 import { Address } from "../../../../address/core/domain/address.entity";
 import { BankAccountWithIban } from "../../../../bank-accounts/infrastructure/repositories/bank-account.repository";
 import { PayableInvoiceReceivable } from "../../../../receivables/core/domain/types";
@@ -20,8 +20,7 @@ export const getCannotPayInvoiceReceivableWithFintectureReason = (
     reasons.push(CannotPayInvoiceReceivableWithFintectureReason.INVOICE_RECEIVABLE_PAYMENT_CURRENCY_MUST_BE_EUR);
   }
 
-  // eslint-disable-next-line eqeqeq
-  if (bankAccountWithIban.iban.ibanNumber == null) {
+  if (isNil(bankAccountWithIban.iban.ibanNumber)) {
     reasons.push(CannotPayInvoiceReceivableWithFintectureReason.INVOICE_RECEIVABLE_ORGANISATION_EMPTY_IBAN);
   }
 
diff --git a/libeo/src/user-extensions/fintecture/fintecture-inbound/utils/getCannotPayInvoiceWithFintectureReason.ts b/libeo/src/user-extensions/fintecture/fintecture-inbound/utils/getCannotPayInvoiceWithFintectureReason.ts
index 1b7e9db820..d2d2dbc6c3 100644
--- a/libeo/src/user-extensions/fintecture/fintecture-inbound/utils/getCannotPayInvoiceWithFintectureReason.ts
+++ b/libeo/src/user-extensions/fintecture/fintecture-inbound/utils/getCannotPayInvoiceWithFintectureReason.ts
@@ -1,4 +1,4 @@
-import { CurrencyCode } from "@libeo/utils";
+import { CurrencyCode, isNil } from "@libeo/utils";
 import { Address } from "../../../../address/core/domain/address.entity";
 import { PayableInvoice } from "../../../../invoice/invoice.type";
 import { Supplier } from "../../../../supplier/core/domain/supplier/supplier.entity";
@@ -21,8 +21,7 @@ export const getCannotPayInvoiceWithFintectureReason = (
     reasons.push(CannotPayInvoiceWithFintectureReason.INVOICE_PAYMENT_CURRENCY_MUST_BE_EUR);
   }
 
-  // eslint-disable-next-line eqeqeq
-  if (supplier.defaultPaymentDestination?.iban?.ibanNumber == null) {
+  if (isNil(supplier.defaultPaymentDestination?.iban?.ibanNumber)) {
     reasons.push(CannotPayInvoiceWithFintectureReason.INVOICE_SUPPLIER_EMPTY_IBAN);
   }
 
`
