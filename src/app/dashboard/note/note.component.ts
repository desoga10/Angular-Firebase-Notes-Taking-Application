import { Component, OnInit, ViewChild } from '@angular/core';
import { Note } from 'src/app/note';
import { NoteService } from 'src/app/note.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
})
export class NoteComponent implements OnInit {
  showAddModal: boolean = false;
  display = 'none';

  noteForm!: FormGroup;
  editForm!: FormGroup;

  public noteDetails: any;
  notes: any = [];

  noteObj: Note = {
    id: '',
    note_title: '',
    note_description: '',
  };

  constructor(
    private note: NoteService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.noteForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.editForm = this.formBuilder.group({
      edited_title: ['', Validators.required],
      edited_description: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getAllNotes();
  }

  //Implement Get All Notes
  getAllNotes() {
    this.spinner.show();
    this.note.getNotes().subscribe((res: Note[]) => {
      this.notes = res;
      this.spinner.hide();
    });
  }

  //Implement Add a Note
  addNote() {
    const { value } = this.noteForm;
    console.log(this.noteForm.value);
    this.noteObj.id = '';
    this.noteObj.note_title = value.title;
    this.noteObj.note_description = value.description;

    this.note.addNote(this.noteObj).then((note) => {
      if (note) {
        alert('Note Added successfully');
        this.noteForm.reset();
      }
    });
  }

  //Implement Delete a Note
  deleteNote(note: Note) {
    let decision = confirm('Are you sure you want to delete this note?');
    if (decision === true) {
      // Do whatever if the user clicked ok.
      this.note.deleteNote(note);
    }
  }

  //Implement Get Note Details
  getNotesDetails(note: Note) {
    this.noteDetails = note;
  }

  //Implement Update Note
  updateNote(note: Note) {
    const { value } = this.editForm;

    this.noteObj.id = note.id;
    this.noteObj.note_title = value.edited_title;
    this.noteObj.note_description = value.edited_description;

    this.note.updateNote(note, this.noteObj).then(() => {
      alert('Note Updated Successfully');
    });
    this.editForm.reset();
  }
}
