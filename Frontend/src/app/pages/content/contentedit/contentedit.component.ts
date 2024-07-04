import { Component } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Validators } from '@angular/forms';
import { ContentService } from 'src/app/core/services/content.service';
import { Article } from 'src/app/core/interfaces/IArticle';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-contentedit',
  templateUrl: './contentedit.component.html',
  styleUrls: ['./contentedit.component.scss']
})
export class ContenteditComponent {
  articleForm: FormGroup;
  articleId!: string;
  isDarkMode: boolean = false;
  editMode: boolean = false;
  constructor(
    private fb: FormBuilder,
    private contentService: ContentService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr : ToastrService
  ) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      author: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id')!;
    this.editMode = !!this.articleId;
    if (this.articleId && this.editMode) {
      this.contentService.getArticle(this.articleId).subscribe((article : any) => {
        console.log(article)
        this.articleForm.patchValue(article.result);
      });
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
  }

  onSubmit(): void {
    if (this.articleForm.valid) {
      const article: Article = this.articleForm.value;
      if (this.articleId) {
        this.contentService.updateArticle(this.articleId, article).subscribe((response : any) => {
          // this.router.navigate(['/content-list']);
          this.toastr.info(`${response.message}`, `Success!`,{
            timeOut: 3000,
            closeButton: true,
            progressBar: true,
          });
          this.router.navigateByUrl('/pages/content/dashboard')
        });
      } else {
        this.contentService.createArticle(article).subscribe((response: any) => {
          this.toastr.info(`${response.message}`, `Success!`,{
            timeOut: 3000,
            closeButton: true,
            progressBar: true,
          });
          // this.router.navigate(['/content-list']);
        });
      }
    }
  }
}
