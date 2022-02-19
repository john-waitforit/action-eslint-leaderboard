export const diffWithDisableNextLineRemoved = `diff --git a/project/src/main.ts b/project/src/main.ts
index 04af25ef2b..e4403d3b60 100755
--- a/project/src/main.ts
+++ b/project/src/main.ts
@@ -42,5 +42,4 @@ async function bootstrap(): Promise<void> {
   await app.listen(port);
 }

-// eslint-disable-next-line no-console
 bootstrap().catch(console.error);
`

export const diffWithTwoNewDisableLines = `diff --git a/project/src/main.ts b/project/src/main.ts
index 04af25ef2b..e858923bb0 100755
--- a/project/src/main.ts
+++ b/project/src/main.ts
@@ -39,6 +39,10 @@ async function bootstrap(): Promise<void> {
     fs.unlinkSync(port);
   }

+  // eslint-disable-next-line no-console
+  console.log("Server starting ...");
+  // eslint-disable-next-line no-console
+  console.log('Listenning on port: ', port);
   await app.listen(port);
 }
`
export const diffWithNewFileDisableAndNextLineRemoved = `diff --git a/project/src/main.ts b/project/src/main.ts
index 04af25ef2b..47d51da433 100755
--- a/project/src/main.ts
+++ b/project/src/main.ts
@@ -1,3 +1,4 @@
+/* eslint-disable no-console */
 import { NestFactory } from "@nestjs/core";
 /* eslint-disable import/order */
 import * as express from "express";
@@ -42,5 +43,4 @@ async function bootstrap(): Promise<void> {
   await app.listen(port);
 }

-// eslint-disable-next-line no-console
 bootstrap().catch(console.error);`
