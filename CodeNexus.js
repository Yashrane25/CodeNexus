document.addEventListener("DOMContentLoaded", function () {
  const searchBTN = document.getElementById("searchBTN");
  const userName = document.getElementById("userName");
  const statContainer = document.querySelector(".statContainer");
  const easyProgress = document.querySelector(".easyProgress");
  const mediumProgress = document.querySelector(".mediumProgress");
  const hardProgress = document.querySelector(".hardProgress");
  const easy = document.getElementById("easy");
  const medium = document.getElementById("medium");
  const hard = document.getElementById("hard");
  const cardStatsContainer = document.querySelector(".statsCards");

  // returns the usersName is valid or not based on regular expretion (regex) //
  function validUserName(usersName) {
    if (usersName.trim() === "") {
      alert("Username should not be enpty!");
      return false;
    }

    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(usersName);

    if (!isMatching) {
      alert("Invalid user name!");
    }

    return isMatching;
  }

  async function fetchDetails(usersName) {
    try {
      searchBTN.textContent = "searching...";
      searchBTN.disabled = true;

      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const targetUrl = "https://leetcode.com/graphql/";
      // concatinated url:https://leetcode.com/graphql/

      const myHeaders = new Headers();
      myHeaders.append("content-type", "application/json");

      const graphql = JSON.stringify({
        query:
          "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
        variables: { username: `${usersName}` },
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: graphql,
        redrict: "follow",
      };

      const response = await fetch(proxyUrl + targetUrl, requestOptions);
      if (!response.ok) {
        throw new Error("Enable to fetch users details!");
      }

      const parsedData = await response.json();
      console.log("Login data: ", parsedData);

      dispalyUserData(parsedData);

      // const stats = data.data.matchedUser.submitStats.acSubmissionNum;

      // // Update DOM
      // stats.forEach((stat) => {
      //   const { difficulty, count } = stat;
      //   const progressElement =
      //     difficulty === "Easy"
      //       ? easyProgress
      //       : difficulty === "Medium"
      //       ? mediumProgress
      //       : hardProgress;

      //   progressElement.style.setProperty(
      //     "--progress-degree",
      //     `${(count / 500) * 100}%`
      //   );
      //   const textElement =
      //     difficulty === "Easy"
      //       ? easy
      //       : difficulty === "Medium"
      //       ? medium
      //       : hard;
      //   textElement.textContent = count;
      // });
    } catch (error) {
      statContainer.innerHTML = "<p>No data found</p>";
    } finally {
      searchBTN.textContent = "search";
      searchBTN.disabled = false;
    }
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function dispalyUserData(parsedData) {
    const totalQuestions = parsedData.data.allQuestionsCount[0].count;

    const totalEasyQuestions = parsedData.data.allQuestionsCount[1].count;

    const totalMediumQuestions = parsedData.data.allQuestionsCount[2].count;

    const totalHardQuestions = parsedData.data.allQuestionsCount[3].count;

    const solvedTotalQuestions =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;

    const solvedTotalEasyQuestions =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;

    const solvedTotalMediumQuestions =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;

    const solvedTotalHardQuestions =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

    updateProgress(
      solvedTotalEasyQuestions,
      totalEasyQuestions,
      easy,
      easyProgress
    );

    updateProgress(
      solvedTotalMediumQuestions,
      totalMediumQuestions,
      medium,
      mediumProgress
    );

    updateProgress(
      solvedTotalHardQuestions,
      totalHardQuestions,
      hard,
      hardProgress
    );
  }

  searchBTN.addEventListener("click", function () {
    const usersName = userName.value.trim();
    console.log("Login username: ", usersName);

    if (validUserName(usersName)) {
      fetchDetails(usersName);
    }
  });
});
