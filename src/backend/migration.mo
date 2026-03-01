import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  type OldActor = {
    students : Map.Map<Nat, SubmittedStudent>;
    sessions : Map.Map<Text, Session>;
    admins : Map.Map<Text, Admin>;
    nextId : Nat;
  };

  type Session = {
    token : Text;
    collegeId : Text;
    expires : Int;
  };

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
    hasStarAchievement : Bool;
    starNote : ?Text;
  };

  type Admin = {
    collegeId : Text;
    email : Text;
    passwordHash : Text;
    name : Text;
  };

  type StarAnnouncement = {
    id : Nat;
    emoji : Text;
    text : Text;
    createdAt : Int;
  };

  public type NewActor = {
    students : Map.Map<Nat, SubmittedStudent>;
    sessions : Map.Map<Text, Session>;
    admins : Map.Map<Text, Admin>;
    starAnnouncements : Map.Map<Nat, StarAnnouncement>;
    nextId : Nat;
    nextAnnouncementId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let starAnnouncements = Map.singleton<Nat, StarAnnouncement>(
      0,
      {
        id = 0;
        emoji = "🏆";
        text = "Tanrum Nur Seeam secured National Rank #143 \u{2014} Dhaka Medical College (HSC 2025)";
        createdAt = Time.now();
      },
    );
    {
      old with
      starAnnouncements;
      nextAnnouncementId = 1;
    };
  };
};
