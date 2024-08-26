import { Logger } from '../dataType/Logger';
import { asn1, pkcs12, pki, util } from 'node-forge';
import path = require('path');
import fs = require('fs');
import { Uri, workspace } from 'vscode';


export class CertificateActions {

  /**
   * Generates a certificate and saves it as a PFX file in the workspace.
   * @param certPassword - The password to protect the generated certificate.
   * @returns A base64-encoded string representation of the generated PFX file.
   */
  public static async generateCertificate(certPassword: string): Promise<string> {
    try {
      const keys = pki.rsa.generateKeyPair(2048);
      const cert = pki.createCertificate();

      cert.publicKey = keys.publicKey;
      cert.serialNumber = '01';
      cert.validity.notBefore = new Date();
      cert.validity.notAfter = new Date();
      cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
      const attrs = [{ name: 'commonName', value: 'example.com' }];
      cert.setSubject(attrs);
      cert.setIssuer(attrs);
      cert.setExtensions([{ name: 'basicConstraints', cA: true }]);
      cert.sign(keys.privateKey);
      const pem = pki.certificateToPem(cert);
      pki.privateKeyToPem(keys.privateKey);

      const p12Asn1 = pkcs12.toPkcs12Asn1(keys.privateKey, [cert], certPassword);
      const p12Der = asn1.toDer(p12Asn1).getBytes();
      const p12b64 = util.encode64(p12Der);

      const workspaceFolder = workspace.workspaceFolders?.[0];
      const workspacePath = workspaceFolder?.uri.fsPath;

      if (!workspacePath) {
        return '';
      }

      const pfxPath = path.join(workspacePath, 'temp', 'certificate.pfx');
      await workspace.fs.writeFile(Uri.file(pfxPath), Buffer.from(p12b64, 'base64'));

      const certPath = path.join(workspacePath, 'temp', 'certificate.cer');
      await workspace.fs.writeFile(Uri.file(certPath), Buffer.from(pem));

      const pfxData = fs.readFileSync(pfxPath);
      const pfxBase64 = pfxData.toString('base64');
      return pfxBase64;
    } catch (e) {
      Logger.error(`Error generating certificate: ${e}`);
      return '';
    }
  }
}