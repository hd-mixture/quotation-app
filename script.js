document.addEventListener('DOMContentLoaded', () => {
    const itemRowsContainer = document.getElementById('item-rows');
    const addItemBtn = document.getElementById('add-item-btn');

    // Function to calculate amount for a row
    function calculateAmount(row) {
        const qtyInput = row.querySelector('.item-qty');
        const rateInput = row.querySelector('.item-rate');
        const amountInput = row.querySelector('.item-amount');

        const qty = parseFloat(qtyInput.value) || 0;
        const rate = parseFloat(rateInput.value) || 0;

        const amount = qty * rate;
        amountInput.value = amount.toFixed(2);
    }

    // Function to add event listeners to a row for calculation and removal
    function addItemEventListeners(row) {
        const qtyInput = row.querySelector('.item-qty');
        const rateInput = row.querySelector('.item-rate');
        // const descriptionInput = row.querySelector('.item-description'); // No specific event listener needed for textarea
        const removeBtn = row.querySelector('.remove-item-btn'); // Remove button added back

        qtyInput.addEventListener('input', () => calculateAmount(row));
        rateInput.addEventListener('input', () => calculateAmount(row));

        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                row.remove();
                // Future: Recalculate total if needed
            });
        }
    }

    // Function to create a new item row
    function createItemRow(item = {}) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Sr. No.">${itemRowsContainer.children.length + 1}</td>
            <td data-label="Description"><textarea class="item-description" rows="2" cols="30">${item.description || ''}</textarea></td>
            <td data-label="Qty"><input type="number" class="item-qty" value="${item.qty || ''}"></td>
            <td data-label="Unit"><input type="text" class="item-unit" value="${item.unit || ''}"></td>
            <td data-label="Rate"><input type="number" class="item-rate" value="${item.rate || ''}"></td>
            <td data-label="Amount"><input type="text" class="item-amount" value="${item.amount || ''}" readonly></td>
            <td><button class="remove-item-btn" aria-label="Remove Item"><span class="remove-icon">&times;</span></button></td>
        `;
        addItemEventListeners(row);
        return row;
    }

    // Add event listener to the Add Item button
    addItemBtn.addEventListener('click', () => {
        const newRow = createItemRow();
        itemRowsContainer.appendChild(newRow);
    });

    // Automatic numbering for Terms & Conditions textarea
    const termsTextarea = document.getElementById('terms-conditions');
    if (termsTextarea) {
        termsTextarea.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent default Enter behavior (new line)

                const textarea = this;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const value = textarea.value;

                // Get the line the cursor is currently on
                const lines = value.substring(0, start).split('\n');
                const currentLine = lines[lines.length - 1];

                let nextNumber = 1;
                const lastNumberedMatch = currentLine.match(/^\s*\((\d+)\)\s*/);

                if (lastNumberedMatch && lastNumberedMatch[1]) {
                    nextNumber = parseInt(lastNumberedMatch[1]) + 1;
                } else {
                     // If the current line wasn't numbered, find the last numbered line above
                     for (let i = lines.length - 2; i >= 0; i--) {
                         const match = lines[i].match(/^\s*\((\d+)\)\s*/);
                         if (match && match[1]) {
                             nextNumber = parseInt(match[1]) + 1;
                             break;
                         }
                     }
                }

                const textBefore = value.substring(0, start);
                const textAfter = value.substring(end);

                const newlineText = '\n(' + nextNumber + ') ';

                textarea.value = textBefore + newlineText + textAfter;

                // Move cursor to the end of the newly inserted text
                textarea.selectionStart = textarea.selectionEnd = start + newlineText.length;
            }
        });
    }

    // Add event listener to the Export to PDF button
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    exportPdfBtn.addEventListener('click', () => {
        window.print();
    });

    // Add event listeners to the initial row(s) if any
    itemRowsContainer.querySelectorAll('tr').forEach(row => {
        addItemEventListeners(row);
    });

}); 