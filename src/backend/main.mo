import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Time "mo:core/Time";

actor {
  type Category = {
    #fatLoss;
    #muscle;
    #running;
    #nutrition;
  };

  type Article = {
    title : Text;
    category : Category;
    content : Text;
    tags : [Text];
  };

  type PlanLevel = {
    #beginner;
    #intermediate;
    #advanced;
  };

  type PlanScheduleEntry = {
    day : Nat;
    activity : Text;
    distanceKm : Float;
    isRestDay : Bool;
  };

  type RunningPlan = {
    level : PlanLevel;
    schedule : [PlanScheduleEntry];
  };

  type RunLog = {
    date : Int;
    distanceKm : Float;
    caloriesBurned : Nat;
    notes : Text;
  };

  type Goal = {
    name : Text;
    targetDistanceKm : Float;
    targetDays : Nat;
    startDate : Int;
    completedDays : Nat;
  };

  // Store articles and running plans as stable persistent data.
  let persistentArticles = List.fromArray<Article>([
    {
      title = "Beginner Running Tips";
      category = #running;
      content = "Start slow, focus on consistency, and listen to your body.";
      tags = ["running", "beginner"];
    },
    {
      title = "Fat Loss Myths Debunked";
      category = #fatLoss;
      content = "Common myths about fat loss and how to avoid them.";
      tags = ["fat loss", "myths"];
    },
    {
      title = "Muscle Building Essentials";
      category = #muscle;
      content = "Key principles for building muscle effectively.";
      tags = ["muscle", "training"];
    },
    {
      title = "Nutrition for Runners";
      category = #nutrition;
      content = "Optimal nutrition strategies for runners.";
      tags = ["nutrition", "running"];
    },
    {
      title = "Advanced Running Techniques";
      category = #running;
      content = "Improve your running with advanced techniques.";
      tags = ["running", "advanced"];
    },
    {
      title = "Healthy Meal Planning";
      category = #nutrition;
      content = "Meal planning tips for a healthy lifestyle.";
      tags = ["nutrition", "meal planning"];
    },
  ]);
  let persistentRunningPlans = List.fromArray<RunningPlan>([
    {
      level = #beginner;
      schedule = [
        { day = 1; activity = "Easy Run"; distanceKm = 2.0; isRestDay = false },
        { day = 2; activity = "Rest Day"; distanceKm = 0.0; isRestDay = true },
        { day = 3; activity = "Interval Training"; distanceKm = 2.5; isRestDay = false },
        { day = 4; activity = "Easy Run"; distanceKm = 2.0; isRestDay = false },
        { day = 5; activity = "Long Run"; distanceKm = 3.5; isRestDay = false },
      ];
    },
    {
      level = #intermediate;
      schedule = [
        { day = 1; activity = "Steady Run"; distanceKm = 4.0; isRestDay = false },
        { day = 2; activity = "Cross Training"; distanceKm = 0.0; isRestDay = false },
        { day = 3; activity = "Interval Running"; distanceKm = 4.5; isRestDay = false },
        { day = 4; activity = "Tempo Run"; distanceKm = 5.0; isRestDay = false },
        { day = 5; activity = "Long Run"; distanceKm = 6.0; isRestDay = false },
      ];
    },
    {
      level = #advanced;
      schedule = [
        { day = 1; activity = "Interval Sprints"; distanceKm = 6.0; isRestDay = false },
        { day = 2; activity = "Hill Repeats"; distanceKm = 5.0; isRestDay = false },
        { day = 3; activity = "Tempo Run"; distanceKm = 7.0; isRestDay = false },
        { day = 4; activity = "Recovery Run"; distanceKm = 4.0; isRestDay = false },
        { day = 5; activity = "Long Endurance Run"; distanceKm = 10.0; isRestDay = false },
      ];
    },
  ]);

  let persistentRunLogs = Map.empty<Principal, List.List<RunLog>>();
  let persistentGoals = Map.empty<Principal, List.List<Goal>>();

  public query ({ caller }) func getArticles() : async [Article] {
    persistentArticles.values().toArray();
  };

  public query ({ caller }) func getArticlesByCategory(category : Category) : async [Article] {
    persistentArticles.filter(func(article) { article.category == category }).values().toArray();
  };

  public query ({ caller }) func getRunningPlans() : async [RunningPlan] {
    persistentRunningPlans.values().toArray();
  };

  public query ({ caller }) func getRunningPlanByLevel(level : PlanLevel) : async ?RunningPlan {
    persistentRunningPlans.find(func(plan) { plan.level == level });
  };

  public query ({ caller }) func getRunLogs() : async [RunLog] {
    switch (persistentRunLogs.get(caller)) {
      case (null) { [] };
      case (?runLogs) {
        runLogs.values().toArray();
      };
    };
  };

  public query ({ caller }) func getGoals() : async [Goal] {
    switch (persistentGoals.get(caller)) {
      case (null) { [] };
      case (?goals) {
        goals.values().toArray();
      };
    };
  };

  public shared ({ caller }) func addRunLog(distanceKm : Float, caloriesBurned : Nat, notes : Text) : async () {
    let runLog : RunLog = {
      date = Time.now();
      distanceKm;
      caloriesBurned;
      notes;
    };

    switch (persistentRunLogs.get(caller)) {
      case (null) {
        let newLogList = List.empty<RunLog>();
        newLogList.add(runLog);
        persistentRunLogs.add(caller, newLogList);
      };
      case (?runLogs) {
        runLogs.add(runLog);
      };
    };
  };

  public shared ({ caller }) func addGoal(name : Text, targetDistanceKm : Float, targetDays : Nat) : async () {
    let goal : Goal = {
      name;
      targetDistanceKm;
      targetDays;
      startDate = Time.now();
      completedDays = 0;
    };
    switch (persistentGoals.get(caller)) {
      case (null) {
        let newGoalList = List.empty<Goal>();
        newGoalList.add(goal);
        persistentGoals.add(caller, newGoalList);
      };
      case (?goalList) {
        goalList.add(goal);
      };
    };
  };

  public shared ({ caller }) func updateGoalProgress(goalIndex : Nat, daysCompleted : Nat) : async () {
    switch (persistentGoals.get(caller)) {
      case (null) { Runtime.trap("User goals not found") };
      case (?userGoals) {
        if (goalIndex >= userGoals.size()) { Runtime.trap("Invalid goal index") };
        let newUserGoals = List.empty<Goal>();
        var i = 0;
        for (goal in userGoals.values()) {
          if (i == goalIndex) {
            newUserGoals.add({
              name = goal.name;
              targetDistanceKm = goal.targetDistanceKm;
              targetDays = goal.targetDays;
              startDate = goal.startDate;
              completedDays = daysCompleted;
            });
          } else {
            newUserGoals.add(goal);
          };
          i += 1;
        };
        persistentGoals.add(caller, newUserGoals);
      };
    };
  };
};
