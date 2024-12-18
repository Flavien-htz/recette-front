import {Component, OnInit, OnDestroy} from '@angular/core';
import {FullCalendarModule} from '@fullcalendar/angular';
import {CalendarOptions, DateSelectArg, EventClickArg, EventInput} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {MatDialog} from '@angular/material/dialog';
import {EventDialogComponent} from './event-dialog/event-dialog.component';
import {AddEventDialogComponent} from './add-event-dialog/add-event-dialog.component';
import {MenuService} from '../services/menu/menu.service';
import {map} from 'rxjs/operators';
import {UpdateEventDialogComponent} from './update-event-dialog/update-event-dialog.component';


@Component({
  selector: 'app-menu',
  imports: [
    FullCalendarModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit, OnDestroy {
  events: EventInput[] = [];

  private isMobile(): boolean {
    return window.innerWidth < 768;
  }

  calendarOptions: CalendarOptions = {
    locale: 'fr',
    firstDay: 1,
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      right: 'dayGridWeek,dayGridDay'
    },
    buttonText: {
      week: 'Semaine',
      day: 'Jour',
      today: 'Aujourd\'hui'
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    select: this.handleDateSelect.bind(this),
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    height: 500,
    longPressDelay: 100,
    selectLongPressDelay: 100,
    selectConstraint: {
      start: '00:00',
      end: '24:00',
    },
    selectMinDistance: 0,
    unselectAuto: false,
    eventDrop: (info) => {
      const event = info.event;
      const newStartDate = this.formatDateForBackend(event.start!);
      const newEndDate = this.formatDateForBackend(event.end || event.start!);

      // Créer l'objet de mise à jour
      const updatedMenu = {
        title: event.title,
        startDate: newStartDate,
        endDate: newEndDate
      };

      // Appeler le service pour mettre à jour
      this.menuService.updateMenu(event.id, updatedMenu).subscribe({
        next: (response) => {
          // console.log('Événement mis à jour avec succès');
        },
        error: (error) => {
          // console.error('Erreur lors de la mise à jour', error);
          info.revert(); // Annuler le drag & drop en cas d'erreur
        }
      });
    },
  };

  private updateToolbarButtons() {
    if (this.isMobile()) {
      this.calendarOptions.headerToolbar = {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridWeek,dayGridDay'
      };
    } else {
      this.calendarOptions.headerToolbar = {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridWeek,dayGridDay'
      };
    }
  }

  ngOnInit() {
    this.updateToolbarButtons();
    this.calendarOptions.initialView = this.isMobile() ? 'dayGridDay' : 'dayGridWeek';

    window.addEventListener('resize', () => {
      this.updateToolbarButtons();
      const newView = this.isMobile() ? 'dayGridDay' : 'dayGridWeek';
      const calendar = document.querySelector('full-calendar');
      if (calendar) {
        // @ts-ignore
        calendar.getApi().changeView(newView);
      }
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => {
    });
  }

  constructor(private dialog: MatDialog, private menuService: MenuService) {
    this.menuService.getMenus().pipe(
      map((menus: any) => {
        return menus.map((menu: any) => {
          return {
            id: menu.id,
            title: menu.nom,
            start: this.formatDateWithoutTimezone(menu.startDate),
            end: this.formatDateWithoutTimezone(menu.endDate),
            backgroundColor: this.extractTime(menu.startDate).startsWith('12') ? 'green' : 'blue'
          }
        })
      })
    ).subscribe(events => {
      this.events = events;
      this.calendarOptions.events = this.events;
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '400px',
      data: {date: selectInfo.start}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.menuService.createMenu(result).subscribe({
          next: (response) => {
            if(result.moment == "both"){
              for (let i = 0; i < 2; i++) {
                const calendarApi = selectInfo.view.calendar;
                calendarApi.unselect();
                if(i == 0){
                  result.startTime = "12:00";
                  result.endTime = "13:00";
                  result.backgroundColor = "green";
                }else {
                  result.startTime = "19:00";
                  result.endTime = "20:00";
                  result.backgroundColor = "blue";
                }
                calendarApi.addEvent({
                  title: result.title,
                  start: `${selectInfo.startStr.split('T')[0]}T${result.startTime}:00`,
                  end: `${selectInfo.startStr.split('T')[0]}T${result.endTime}:00`,
                  backgroundColor: result.backgroundColor
                })
              }
            }else{
              const calendarApi = selectInfo.view.calendar;
              calendarApi.unselect();
              calendarApi.addEvent({
                title: result.title,
                start: `${selectInfo.startStr.split('T')[0]}T${result.startTime}:00`,
                end: `${selectInfo.startStr.split('T')[0]}T${result.endTime}:00`,
                backgroundColor: result.backgroundColor
              })
            }
          },
          error: (error) => {
            /* TODO : Gérer l'erreur */
          }
        })

      }
    });
  }

  handleEventClick(clickInfo: EventClickArg) {

    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data: clickInfo.event
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'edit') {
        const dialogRefUpdate = this.dialog.open(UpdateEventDialogComponent, {
          width: '400px',
          data: clickInfo.event
        })
        dialogRefUpdate.afterClosed().subscribe(result => {
          if (result) {
            result.startDate = clickInfo.event.startStr.split('T')[0]+' '+result.startTime+':00';
            result.endDate = clickInfo.event.startStr.split('T')[0]+' '+result.endTime+':00';
            this.menuService.updateMenu(clickInfo.event.id, result).subscribe({
              next: (response) => {
                clickInfo.event.setProp('title', result.title);
                clickInfo.event.setStart(`${clickInfo.event.startStr.split('T')[0]}T${result.startTime}:00`);
                clickInfo.event.setEnd(`${clickInfo.event.startStr.split('T')[0]}T${result.endTime}:00`);
                clickInfo.event.setProp('backgroundColor', result.backgroundColor);
              },
              error: (error) => {
                /* TODO : Gérer l'erreur */
              }
            })

          }
        });
      } else if (result?.action === 'delete') {
        if (confirm(`Voulez-vous supprimer l'événement "${clickInfo.event.title}" ?`)) {
          clickInfo.event.remove();
        }
      }
    });
  }

  extractTime(dateTime: string): string {
    const [_, time] = dateTime.split(' '); // Sépare la date et l'heure
    return time;
  }

  formatDateWithoutTimezone(dateString: string): string {
    const [datePart, timePart] = dateString.split(' ');
    return `${datePart}T${timePart}:00`; // Ajout manuel des secondes
  }

  private formatDateForBackend(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  formatDateTime(date: Date, time: string): string {
    // Obtenir la partie date au format 'yyyy-MM-dd'
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Mois commence à 0
    const day = String(date.getDate()).padStart(2, '0');

    // Construire la chaîne formatée
    return `${year}-${month}-${day} ${time}`;
  }

}
