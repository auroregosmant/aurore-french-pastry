fetch('glossary - glossary.csv')
  .then(response => response.text())
  .then(csvText => {
    const data = Papa.parse(csvText, { header: true }).data.filter(row => row.title && row.image && row.link);
    const grid = document.querySelector('.recipes-grid');
    const filterContainer = document.getElementById('category-filter');

    if (!grid || !filterContainer) return;

    // 1. Extract unique categories from the CSV
    const categories = [...new Set(data.map(row => row.category).filter(Boolean))];
    
    // 2. Create the filter dropdown
    filterContainer.innerHTML = `
      <label for="category-select" style="margin-right: 0.5rem;">Filtrer par catégorie:</label>
    `;

    const select = document.createElement('select');
    select.id = 'category-select';
    select.innerHTML = `<option value="all">Toutes les catégories</option>`;
    categories.forEach(category => {
      select.innerHTML += `<option value="${category}">${category}</option>`;
    });
    filterContainer.appendChild(select);

    // 3. Function to render filtered cards
    const renderCards = (filter = 'all') => {
      grid.innerHTML = ''; // clear previous cards
      const filteredData = filter === 'all' ? data : data.filter(row => row.category === filter);

      filteredData.forEach(row => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
          <a href="${row.link}">
            <img src="${row.image}" alt="${row.title}" class="recipe-card-img">
            <div class="recipe-card-content">
              <h3 class="recipe-card-title">${row.title}</h3>
              <p class="recipe-card-description">${row.description}</p>
              <p class="recipe-card-details">${row.date}</p>
            </div>
          </a>
        `;
        grid.appendChild(card);
      });
    };

    // 4. Initial render
    renderCards();

    // 5. Filter on change
    select.addEventListener('change', (e) => {
      renderCards(e.target.value);
    });
  });