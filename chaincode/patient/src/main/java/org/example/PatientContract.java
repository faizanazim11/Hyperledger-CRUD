/*
 * SPDX-License-Identifier: Apache-2.0
 */
package org.example;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Default;
import org.hyperledger.fabric.contract.annotation.Transaction;
import org.hyperledger.fabric.contract.annotation.Contact;
import org.hyperledger.fabric.contract.annotation.Info;
import org.hyperledger.fabric.contract.annotation.License;
import static java.nio.charset.StandardCharsets.UTF_8;

@Contract(name = "PatientContract", info = @Info(title = "Patient contract", description = "My Smart Contract", version = "0.0.1", license = @License(name = "Apache-2.0", url = ""), contact = @Contact(email = "patient@example.com", name = "patient", url = "http://patient.me")))
@Default
public class PatientContract implements ContractInterface {
    public PatientContract() {

    }

    @Transaction()
    public boolean patientExists(Context ctx, String patientId) {
        byte[] buffer = ctx.getStub().getState(patientId);
        return (buffer != null && buffer.length > 0);
    }

    @Transaction
    public void createPatient(
            Context ctx,
            String patientId,
            String firstName,
            String middleName,
            String lastName,
            Integer age,
            String gender,
            String condition) {
        boolean exists = patientExists(ctx, patientId);
        if (exists) {
            throw new RuntimeException("The asset " + patientId + " already exists");
        }
        Patient asset = new Patient(firstName, middleName, lastName, age, gender, condition);
        ctx.getStub().putState(patientId, asset.toJSONString().getBytes(UTF_8));
    }

    @Transaction()
    public Patient readPatient(Context ctx, String patientId) {
        boolean exists = patientExists(ctx, patientId);
        if (!exists) {
            throw new RuntimeException("The asset " + patientId + " does not exist");
        }

        Patient newAsset = Patient.fromJSONString(new String(ctx.getStub().getState(patientId), UTF_8));
        return newAsset;
    }

    @Transaction
    public void updatePatient(
            Context ctx,
            String patientId,
            String firstName,
            String middleName,
            String lastName,
            Integer age,
            String gender,
            String condition) {
        boolean exists = patientExists(ctx, patientId);
        if (!exists) {
            throw new RuntimeException("The asset " + patientId + " does not exist");
        }
        Patient asset = new Patient();
        asset.setFirstName(firstName);
        asset.setLastName(lastName);
        asset.setMiddleName(middleName);
        asset.setAge(age);
        asset.setGender(gender);
        asset.setCondition(condition);

        ctx.getStub().putState(patientId, asset.toJSONString().getBytes(UTF_8));
    }

    @Transaction()
    public void deletePatient(Context ctx, String patientId) {
        boolean exists = patientExists(ctx, patientId);
        if (!exists) {
            throw new RuntimeException("The asset " + patientId + " does not exist");
        }
        ctx.getStub().delState(patientId);
    }

}
