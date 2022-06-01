/*
 * SPDX-License-Identifier: Apache-2.0
 */

package org.example;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;
import com.owlike.genson.Genson;

@DataType()
public class Patient {

  private final static Genson genson = new Genson();

  @Property
  private String firstName;

  @Property
  private String middleName;

  @Property
  private String lastName;

  @Property
  private Integer age;

  @Property
  private String gender;

  @Property
  private String condition;

  public Patient() {
  }

  public Patient(String firstName, String middleName, String lastName, Integer age, String gender, String condition) {
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.age = age;
    this.gender = gender;
    this.condition = condition;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getMiddleName() {
    return middleName;
  }

  public void setMiddleName(String middleName) {
    this.middleName = middleName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public Integer getAge() {
    return age;
  }

  public void setAge(Integer age) {
    this.age = age;
  }

  public String getGender() {
    return gender;
  }

  public void setGender(String gender) {
    this.gender = gender;
  }

  public String getCondition() {
    return condition;
  }

  public void setCondition(String condition) {
    this.condition = condition;
  }

  public String toJSONString() {
    return genson.serialize(this).toString();
  }

  public static Patient fromJSONString(String json) {
    Patient asset = genson.deserialize(json, Patient.class);
    return asset;
  }
}
