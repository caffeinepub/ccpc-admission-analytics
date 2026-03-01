import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

actor {
  // Sorted Map to keep students sorted by id
  let students = Map.empty<Nat, SubmittedStudent>();
  var nextId = 0;

  type SubmittedStudent = {
    id : Nat;
    name : Text;
    institution : Text;
    section : Text;
    department : Text;
    rank : ?Nat;
    examType : Text;
    year : Nat;
    submittedAt : Int;
  };

  public shared ({ caller }) func submitStudent(
    name : Text,
    institution : Text,
    section : Text,
    department : Text,
    rank : ?Nat,
    examType : Text,
    year : Nat,
  ) : async Nat {
    let id = nextId;

    let newStudent : SubmittedStudent = {
      id;
      name;
      institution;
      section;
      department;
      rank;
      examType;
      year;
      submittedAt = Time.now();
    };

    students.add(id, newStudent);
    nextId += 1;
    id;
  };

  public query ({ caller }) func getSubmittedStudents() : async [SubmittedStudent] {
    students.values().toArray();
  };

  public shared ({ caller }) func deleteSubmittedStudent(id : Nat) : async Bool {
    let existed = students.containsKey(id);
    students.remove(id);
    existed;
  };

  public query ({ caller }) func ping() : async Text {
    "pong";
  };
};
