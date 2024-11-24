
function generatePostContent(data) {
  const section = document.createElement("section");
  section.className = "post-content post-container";
  section.id = "post-content-detail";
  data.forEach((item) => {
    if (item.type === "heading") {
      const heading = document.createElement("h2");
      heading.className = "sub-heading";
      heading.textContent = item.text;
      section.appendChild(heading);
    } else if (item.type === "paragraph") {
      const paragraph = document.createElement("p");
      paragraph.className = "post-text";
      paragraph.textContent = item.text;
      section.appendChild(paragraph);
    }
  });
  return section;
}

const container = document.getElementById("post-content-detail");
container.appendChild(postContent);
