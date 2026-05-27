import React, { useState } from "react";

export default function Tasks() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const tasks = [
    {
      id: 1,
      title: "Frontend Website Assistant",
      description: "Help improve a company landing page using React and CSS.",
      category: "Web Development",
      budget: 220,
      location: "Budapest",
      deadline: "Today",
      skills: "React, CSS, HTML",
      matchScore: 94,
    },
    {
      id: 2,
      title: "Backend API Support",
      description: "Assist with REST API testing and small backend fixes.",
      category: "Web Development",
      budget: 260,
      location: "Remote",
      deadline: "This week",
      skills: "Java, Spring Boot, APIs",
      matchScore: 91,
    },
    {
      id: 3,
      title: "Website Bug Fixer",
      description: "Fix layout bugs and improve responsive design.",
      category: "Web Development",
      budget: 180,
      location: "Remote",
      deadline: "Tomorrow",
      skills: "JavaScript, CSS, Debugging",
      matchScore: 89,
    },
    {
      id: 4,
      title: "Event Registration Staff",
      description: "Support check-in and guest registration for a business event.",
      category: "Event Staff",
      budget: 150,
      location: "Debrecen",
      deadline: "Tomorrow",
      skills: "Communication, Organization",
      matchScore: 87,
    },
    {
      id: 5,
      title: "Conference Assistant",
      description: "Help guests, prepare badges, and guide attendees during a conference.",
      category: "Event Staff",
      budget: 170,
      location: "Budapest",
      deadline: "Friday",
      skills: "Events, English, Customer Service",
      matchScore: 85,
    },
    {
      id: 6,
      title: "Catering Support Worker",
      description: "Assist catering team with serving and preparation during an event.",
      category: "Hospitality",
      budget: 135,
      location: "Szeged",
      deadline: "Weekend",
      skills: "Hospitality, Teamwork, Service",
      matchScore: 83,
    },
    {
      id: 7,
      title: "Hotel Reception Support",
      description: "Part-time reception support for check-ins and guest communication.",
      category: "Hospitality",
      budget: 190,
      location: "Budapest",
      deadline: "Next week",
      skills: "English, Communication, Hospitality",
      matchScore: 90,
    },
    {
      id: 8,
      title: "Warehouse Packing Assistant",
      description: "Help organize, pack, and label products in a warehouse.",
      category: "Logistics",
      budget: 160,
      location: "Debrecen",
      deadline: "Today",
      skills: "Warehouse, Packing, Reliability",
      matchScore: 82,
    },
    {
      id: 9,
      title: "Delivery Helper",
      description: "Assist with local deliveries and package handling.",
      category: "Logistics",
      budget: 145,
      location: "Budapest",
      deadline: "Tomorrow",
      skills: "Delivery, Time Management, Physical Work",
      matchScore: 80,
    },
    {
      id: 10,
      title: "Social Media Assistant",
      description: "Create short posts and schedule content for a small business.",
      category: "Marketing",
      budget: 210,
      location: "Remote",
      deadline: "This week",
      skills: "Social Media, Writing, Canva",
      matchScore: 88,
    },
    {
      id: 11,
      title: "Brand Promotion Staff",
      description: "Promote a local product at a student event.",
      category: "Marketing",
      budget: 155,
      location: "Debrecen",
      deadline: "Saturday",
      skills: "Marketing, Communication, Sales",
      matchScore: 84,
    },
    {
      id: 12,
      title: "Poster Designer",
      description: "Design a clean promotional poster for an upcoming event.",
      category: "Design",
      budget: 120,
      location: "Remote",
      deadline: "3 days",
      skills: "Design, Canva, Creativity",
      matchScore: 86,
    },
    {
      id: 13,
      title: "UI Design Assistant",
      description: "Help redesign dashboard cards and page layouts.",
      category: "Design",
      budget: 240,
      location: "Remote",
      deadline: "Next week",
      skills: "UI Design, Figma, UX",
      matchScore: 92,
    },
  ];

  function handleApply(taskId) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must login first.");
      return;
    }

    const selectedTask = tasks.find((task) => task.id === taskId);

    const existingApplications = JSON.parse(
      localStorage.getItem("applications") || "[]"
    );

    const newApplication = {
      id: Date.now(),
      task: selectedTask.title,
      freelancer: JSON.parse(localStorage.getItem("user") || "{}").name || "QuickHire User",
      role: "Applicant",
      message: "I am interested in this opportunity.",
      status: "pending",
      score: selectedTask.matchScore,
      budget: `€${selectedTask.budget}`,
    };

    localStorage.setItem(
      "applications",
      JSON.stringify([...existingApplications, newApplication])
    );

    alert("Application submitted successfully!");
  }

  const filteredTasks = tasks.filter((task) => {
    const text = `${task.title} ${task.description} ${task.skills} ${task.location}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    const matchesCategory = category === "All" || task.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="marketplacePage">
      <aside className="filterSidebar">
        <h2>Find Gigs</h2>
        <p>Search short-term freelance opportunities.</p>

        <label>Search</label>
        <input
          placeholder="Search skills, title, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>
          <option>Web Development</option>
          <option>Event Staff</option>
          <option>Hospitality</option>
          <option>Logistics</option>
          <option>Marketing</option>
          <option>Design</option>
        </select>

        <div className="filterBox">
          <strong>Smart Matching</strong>
          <p>
            Gigs are ranked using skills, availability, location, rating, and
            worker performance.
          </p>
        </div>
      </aside>

      <main className="gigResults">
        <div className="marketHeader">
          <div>
            <p className="label">Gig marketplace</p>
            <h1>Available freelance gigs</h1>
          </div>

          <span>{filteredTasks.length} results</span>
        </div>

        <div className="gigList">
          {filteredTasks.map((task) => (
            <div className="gigCardNew" key={task.id}>
              <div className="gigTop">
                <div>
                  <span className="gigCategory">{task.category}</span>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                </div>

                <div className="gigPay">
                  <strong>€{task.budget}</strong>
                  <span>budget</span>
                </div>
              </div>

              <div className="gigMeta">
                <span>📍 {task.location}</span>
                <span>🕒 {task.deadline}</span>
                <span>⭐ Match score: {task.matchScore}%</span>
              </div>

              <div className="skillRow">
                {task.skills.split(",").map((skill, index) => (
                  <span key={index}>{skill.trim()}</span>
                ))}
              </div>

              <div className="gigActions">
                <button onClick={() => handleApply(task.id)}>Apply Now</button>
                <button className="outlineSmall">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}