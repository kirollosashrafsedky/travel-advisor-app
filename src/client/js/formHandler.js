const form = document.getElementById("main-form");

const testFun = async (e) => {
  e.preventDefault();
  const res = await fetch("https://travel-advisor-app-test.herokuapp.com/test")
  try {
    const data = await res.json();
    alert(data.test);
  }catch(error) {
    console.log("error", error);
  }
}

form.addEventListener('submit',testFun)

export { testFun }
