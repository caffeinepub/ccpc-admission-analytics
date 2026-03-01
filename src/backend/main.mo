import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Migration "migration";
import Int "mo:core/Int";
import Order "mo:core/Order";

(with migration = Migration.run)
actor {
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

  type OverviewSettings = {
    trendMed2024 : Nat;
    trendBuet2024 : Nat;
    trendMed2025 : Nat;
    yoySubtitle : Text;
    growthOverride : Text;
    med2025Badge : Text;
    med2024Bangla : Text;
    med2024English : Text;
    med2024Total : Text;
    cardLabel0 : Text;
    cardLabel1 : Text;
    cardLabel2 : Text;
    cardLabel3 : Text;
  };

  let students = Map.empty<Nat, SubmittedStudent>();
  let sessions = Map.empty<Text, Session>();
  let admins = Map.empty<Text, Admin>();
  let starAnnouncements = Map.empty<Nat, StarAnnouncement>();

  var nextId = 0;
  var nextAnnouncementId = 0;
  var overviewSettings : ?OverviewSettings = null;
  let sessionTimeout = 60 * 60 * 1000 * 1000 * 1000; // 1 hour

  // DEDUG set as password "ccpc2024admin" should never be stored as plain text
  let defaultAdmin : Admin = {
    collegeId = "CCPC-ADMIN-001";
    email = "admin@ccpc.edu.bd";
    passwordHash = "ccpc2024admin";
    name = "CCPC Admin";
  };

  let defaultStarAnnouncement : StarAnnouncement = {
    id = 0;
    emoji = "🏆";
    text = "Tanrum Nur Seeam secured National Rank #143 \u{2014} Dhaka Medical College (HSC 2025)";
    createdAt = Time.now();
  };

  let defaultOverviewSettings : OverviewSettings = {
    trendMed2024 = 0;
    trendBuet2024 = 0;
    trendMed2025 = 0;
    yoySubtitle = "";
    growthOverride = "";
    med2025Badge = "";
    med2024Bangla = "";
    med2024English = "";
    med2024Total = "";
    cardLabel0 = "";
    cardLabel1 = "";
    cardLabel2 = "";
    cardLabel3 = "";
  };

  // Add default admin/star announcement if not present already
  public shared ({ caller }) func initializeDefaultAdmin() : async () {
    if (admins.isEmpty()) {
      admins.add(defaultAdmin.collegeId, defaultAdmin);
    };
    if (starAnnouncements.isEmpty()) {
      starAnnouncements.add(defaultStarAnnouncement.id, defaultStarAnnouncement);
      nextAnnouncementId += 1;
    };
    if (overviewSettings == null) {
      overviewSettings := ?defaultOverviewSettings;
    };
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
      hasStarAchievement = false;
      starNote = null;
    };

    students.add(id, newStudent);
    nextId += 1;
    id;
  };

  // Anyone can fetch all students
  public query ({ caller }) func getSubmittedStudents() : async [SubmittedStudent] {
    students.values().toArray();
  };

  public shared ({ caller }) func deleteSubmittedStudent(id : Nat) : async Bool {
    let existed = students.containsKey(id);
    students.remove(id);
    existed;
  };

  // Admin login returns session token
  public shared ({ caller }) func adminLogin(collegeId : Text, email : Text, password : Text) : async ?Text {
    switch (admins.get(collegeId)) {
      case (null) { null };
      case (?admin) {
        // Login is successful here if password matches and must be replaced by hashing in production!
        if (admin.passwordHash == password and admin.email == email) {
          let token = collegeId.concat(Time.now().toText());
          let session : Session = {
            token;
            collegeId;
            expires = Time.now() + sessionTimeout;
          };
          sessions.add(token, session);
          ?token;
        } else {
          Runtime.trap("Invalid password or email provided. In a productive environment, the system will work with hashes not clear text passwords");
        };
      };
    };
  };

  public query ({ caller }) func isSessionValid(token : Text) : async Bool {
    switch (sessions.get(token)) {
      case (null) { false };
      case (?session) {
        Time.now() < session.expires;
      };
    };
  };

  func requireAdminSession(token : Text) {
    switch (sessions.get(token)) {
      case (null) {
        Runtime.trap("Session expired. Please login again.");
      };
      case (?session) {
        if (Time.now() > session.expires) {
          sessions.remove(token);
          Runtime.trap("Session expired. Please login again.");
        };
      };
    };
  };

  public shared ({ caller }) func grantStarAchievement(studentId : Nat, sessionToken : Text, note : Text) : async Bool {
    requireAdminSession(sessionToken);
    let student = students.get(studentId);
    switch (student) {
      case (null) { false };
      case (?s) {
        let updatedStudent = {
          s with
          hasStarAchievement = true;
          starNote = ?note;
        };
        students.add(studentId, updatedStudent);
        true;
      };
    };
  };

  public shared ({ caller }) func removeStarAchievement(studentId : Nat, sessionToken : Text) : async Bool {
    requireAdminSession(sessionToken);
    let student = students.get(studentId);
    switch (student) {
      case (null) { false };
      case (?s) {
        let updatedStudent = {
          s with
          hasStarAchievement = false;
          starNote = null;
        };
        students.add(studentId, updatedStudent);
        true;
      };
    };
  };

  public shared ({ caller }) func registerAdmin(collegeId : Text, email : Text, password : Text, name : Text, sessionToken : Text) : async Bool {
    requireAdminSession(sessionToken);

    let admin : Admin = {
      collegeId;
      email;
      passwordHash = password; // TODO: must be hashed in production!
      name;
    };

    admins.add(collegeId, admin);
    true;
  };

  public query ({ caller }) func getAdminList(sessionToken : Text) : async [(Text, Text)] {
    // Runtime.trap if invalid session token
    switch (sessions.get(sessionToken)) {
      case (null) { Runtime.trap("Invalid Session. Please try again or login again!"); };
      case (?session) {
        // Check for session expiration
        if (Time.now() > session.expires) {
          sessions.remove(sessionToken); // Remove expired session
          Runtime.trap("Session expired! Please try again or login again!");
        } else {
          // Session is valid, return admin data
          let adminsArray : [Admin] = admins.values().toArray();
          let adminList : [(Text, Text)] = adminsArray.map(func(admin) { (admin.collegeId, admin.email) });
          adminList;
        };
      };
    };
  };

  // ----- New features ----
  // STAR ANNOUNCEMENTS

  func starAnnouncementCompare(a : StarAnnouncement, b : StarAnnouncement) : Order.Order {
    Int.compare(a.createdAt, b.createdAt);
  };

  public query ({ caller }) func getStarAnnouncements() : async [StarAnnouncement] {
    let announcementArray = starAnnouncements.values().toArray();
    announcementArray.sort(starAnnouncementCompare);
  };

  public shared ({ caller }) func addStarAnnouncement(emoji : Text, text : Text, sessionToken : Text) : async Nat {
    requireAdminSession(sessionToken);

    let announcement : StarAnnouncement = {
      id = nextAnnouncementId;
      emoji;
      text;
      createdAt = Time.now();
    };

    starAnnouncements.add(nextAnnouncementId, announcement);
    nextAnnouncementId += 1;
    announcement.id;
  };

  public shared ({ caller }) func editStarAnnouncement(id : Nat, emoji : Text, text : Text, sessionToken : Text) : async Bool {
    requireAdminSession(sessionToken);

    switch (starAnnouncements.get(id)) {
      case (null) { false };
      case (?existing) {
        let updated : StarAnnouncement = {
          existing with
          emoji;
          text;
        };
        starAnnouncements.add(id, updated);
        true;
      };
    };
  };

  public shared ({ caller }) func removeStarAnnouncement(id : Nat, sessionToken : Text) : async Bool {
    requireAdminSession(sessionToken);
    let existed = starAnnouncements.containsKey(id);
    starAnnouncements.remove(id);
    existed;
  };

  // OVERVIEW SETTINGS
  public query ({ caller }) func getOverviewSettings() : async OverviewSettings {
    switch (overviewSettings) {
      case (null) { defaultOverviewSettings };
      case (?settings) { settings };
    };
  };

  public shared ({ caller }) func updateOverviewSettings(settings : OverviewSettings, sessionToken : Text) : async Bool {
    requireAdminSession(sessionToken);
    overviewSettings := ?settings;
    true;
  };

  public query ({ caller }) func ping() : async Text {
    "pong";
  };
};
