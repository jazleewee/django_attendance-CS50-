document.addEventListener('DOMContentLoaded', function() {
    hide_attendance();
    totals();
    hide_sections();
    estab();
    filter();
    copy();
})

function hide_attendance() {
    const attendance_values = document.querySelectorAll('.attendance-values');

    attendance_values.forEach(function(attendance_value) {
        if (parseInt(attendance_value.innerText.split(":")[1]) === 0) {
            attendance_value.style.display = 'none';

            // Hide accordion headers for detailed staffing
            if (attendance_value.innerText.split(":")[0] == "Untagged Appointments") {
                attendance_value.closest(".accordion-header").style.display = 'none';
            }
        }

    });
}

function totals() {
    const table = document.querySelector("#summary-table");

    if (table != null) {
        var grand_total = 0
        var grand_attended = 0
        var grand_absent = 0
        var grand_deferred = 0
        var grand_early_out_pro = 0
    
        for (let i = 1; i < table.rows.length; i++) {
            for (let j = 1; j < table.rows[0].cells.length; j++) {        
                if (i != table.rows.length-1) {
                    switch (j) {
                        case 1:
                            var sum = 0;
                            for (let col = j+1; col < j+5; col++) {
                                sum += parseInt(table.rows[i].cells[col].innerText);
                            }
                            table.rows[i].cells[j].innerText = sum;                        
                            grand_total += sum;
                            break;                    
                        case 2:
                            grand_attended += parseInt(table.rows[i].cells[j].innerText)
                            break;
                        case 3:
                            grand_absent += parseInt(table.rows[i].cells[j].innerText)
                            break;
                        case 4:
                            grand_deferred += parseInt(table.rows[i].cells[j].innerText)
                            break;
                        case 5:
                            grand_early_out_pro += parseInt(table.rows[i].cells[j].innerText)     
                            break;
                        case 6:
                            strength = Math.round((parseInt(table.rows[i].cells[2].innerText)/parseInt(table.rows[i].cells[1].innerText))*100)                        
                            if (isNaN(strength)) {
                                table.rows[i].cells[j].innerText = '0%';
                            } else {
                                table.rows[i].cells[j].innerText = `${strength}%`;
                            }
                            break;
                    }
                } else {
                    switch(j) {
                        case 1:
                            table.rows[i].cells[j].innerText = grand_total;
                            break;
                        case 2:
                            table.rows[i].cells[j].innerText = grand_attended;
                            break;
                        case 3:
                            table.rows[i].cells[j].innerText = grand_absent;
                            break;
                        case 4:
                            table.rows[i].cells[j].innerText = grand_deferred;
                            break;
                        case 5:
                            table.rows[i].cells[j].innerText = grand_early_out_pro;
                            break;
                        case 6:
                            grand_strength = Math.round(parseInt(table.rows[i].cells[2].innerText)/parseInt(table.rows[i].cells[1].innerText)*100)
                            table.rows[i].cells[j].innerText = `${grand_strength}%`;
                            break;
                    }
                }
            }
        }
    }

}
    
function hide_sections() {
    if (document.querySelector("#summary-table") != null) {
        const dashboard_unknown = document.querySelector(".accordion.unknown") != null;
        if (dashboard_unknown === false) {
            document.querySelector("#dashboard-unknown").style.display = "none";
        }
    
        const absent_mc = document.querySelector(".accordion.absentmc") != null;
        if (absent_mc === false) {
            document.querySelector("#dashboard-absentmc").style.display = "none";
        }
    
        const absent_awol = document.querySelector(".accordion.absentawol") != null;
        if (absent_awol === false) {
            document.querySelector("#dashboard-absentawol").style.display = "none";
        }
    
        const absent_special = document.querySelector(".accordion.absentspecial") != null;
        if (absent_special === false) {
            document.querySelector("#dashboard-absentspecial").style.display = "none";
        }
    
        const deferred = document.querySelector(".accordion.deferred") != null;
        if (deferred === false) {
            document.querySelector("#dashboard-deferred").style.display = "none";
        }
    
        const early_out_pro = document.querySelector(".accordion.early_out_pro") != null;
        if (early_out_pro === false) {
            document.querySelector("#dashboard-earlyoutpro").style.display = "none";
        }
    }
}

function estab() {
    const estab = document.querySelector("#estab-table");

    if (estab != null) {
        // var storm_estab = 0;
        // var bhq_estab = 0;
        // var hq_estab = 0;
        // var A_estab = 0;
        // var B_estab = 0;
        // var C_estab = 0;
        // var SP_estab = 0;
        var estab_total = 0;
        var attended_total = 0;
        var staffing_total = 0;

        for (let i = 1; i < estab.rows.length; i++) {
            for (let j = 1; j < estab.rows[0].cells.length; j++) {
                if (i != estab.rows.length-1) {
                    switch(j) {
                        case 1:
                            estab_total += parseInt(estab.rows[i].cells[j].innerText);
                            break;
                        case 2:
                            attended_total += parseInt(estab.rows[i].cells[j].innerText);
                            break;
                        case 3:
                            estab.rows[i].cells[j].innerText = `${Math.round((parseInt(estab.rows[i].cells[2].innerText)/parseInt(estab.rows[i].cells[1].innerText))*100)}%`;
                            break;
                        case 4:
                            estab.rows[i].cells[j].innerText = parseInt(estab.rows[i].cells[1].innerText)-parseInt(estab.rows[i].cells[j].innerText);
                            staffing_total += parseInt(estab.rows[i].cells[j].innerText);
                            break;
                        case 5:
                            estab.rows[i].cells[j].innerText = `${Math.round((parseInt(estab.rows[i].cells[4].innerText)/parseInt(estab.rows[i].cells[1].innerText))*100)}%`;
                            break;
                    }
                }
                else {
                    switch(j) {
                        case 1:
                            estab.rows[i].cells[j].innerText = estab_total;
                            break;
                        case 2:
                            estab.rows[i].cells[j].innerText = attended_total;
                            break;
                        case 3:
                            estab.rows[i].cells[j].innerText = `${Math.round((parseInt(estab.rows[i].cells[2].innerText)/parseInt(estab.rows[i].cells[1].innerText))*100)}%`;
                            break;
                        case 4:
                            estab.rows[i].cells[j].innerText = staffing_total;
                            break;
                        case 5:
                            estab.rows[i].cells[j].innerText = `${Math.round((parseInt(estab.rows[i].cells[4].innerText)/parseInt(estab.rows[i].cells[1].innerText))*100)}%`;
                            break;
                    }
                }

            }
        }
    }
}

function search() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.querySelector("#search");
    filter = input.value.toUpperCase();
    table = document.querySelector("#names");
    tr = table.querySelectorAll("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].querySelectorAll("td")[2];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
}

function filter() {

    const status = [
        "Attended",
        "Early Out Pro",
        "Deferred",
        "Absent (MC)",
        "Absent (AWOL)",
        "Absent (SPECIAL)",
        "Disruption",
        "Discipline",
        "Unknown"
    ]

    status.forEach(function(status) {        
        checkbox = document.querySelector("" + `#filter-${status.replace(' ','').replace('(','').replace(')','')}`)
        if (checkbox != null) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    document.querySelectorAll("" + `.${status.replace(' ','').replace('(','').replace(')','')}`).forEach(element => element.closest('tr').style.display = 'table-row')
                } else {
                    document.querySelectorAll("" + `.${status.replace(' ','').replace('(','').replace(')','')}`).forEach(element => element.closest('tr').style.display = 'none')
                }
            }); 
        }
    });
}

function copy () {
    if (document.querySelector('#copy') != null) {
        document.querySelector('#copy').addEventListener('click', function() {
            SubUnit1_values = [
                "STORM TM",
                "BATTLE GP HQ",
                "HQ COY",
                "AI COMBAT TM A",
                "AI COMBAT TM B",
                "AI COMBAT TM C",
                "SUPPORT COY",
                "HL 421 SAR",
                "NON-ESTAB"
            ]
        
            var text = ''
            timestamp = document.querySelector('#section-title')
            text = text.concat('*').concat(timestamp.innerText.split('Copy')[0].trim()).concat('*').concat('\n').concat('\n')

            var flag = false
            SubUnit1 = document.querySelectorAll(".accordion-header")
            SubUnit1.forEach(function(element, idx, SubUnit1) {
        
                if (SubUnit1_values.includes(element.querySelector('b').innerText)) {
        
                    if (flag) {
                        text = text.concat('\n-------\n\n')
                        flag = false
                    }
        
                    if (flag == false) {
                        text = text.concat('-------\n')
                        text = text.concat('*').concat(element.querySelector('b').innerText).concat('*')
                        flag = true
                    }
        
                } else {
                    text = text.concat('\n\n').concat('_').concat(element.querySelector('b').innerText).concat('_')
                }
        
                // text = text.concat('\n')
        
                var values = element.querySelectorAll(".attendance-values")
                values.forEach(function(value, index, values) {
                    if (value.innerText.split(":")[1] != 0) {
                        text = text.concat('\n')
                        text = text.concat(value.innerText)
                        // if (index != values.length-1) {
                        //     text = text.concat('\n')
                        // }
                    }
                })
        
                if (flag && idx == SubUnit1.length-1) {
                    text = text.concat('\n-------')
                }
            })
            // console.log(text)
            navigator.clipboard.writeText(text)
            // alert("Copied")
        })
    }
}