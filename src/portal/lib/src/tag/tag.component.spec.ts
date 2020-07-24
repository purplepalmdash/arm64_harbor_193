import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { DebugElement } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { ImageNameInputComponent } from "../image-name-input/image-name-input.component";
import { TagComponent } from "./tag.component";

import { ErrorHandler } from "../error-handler/error-handler";
import { Label, Tag } from "../service/interface";
import { SERVICE_CONFIG, IServiceConfig } from "../service.config";
import {
    TagService, TagDefaultService, ScanningResultService, ScanningResultDefaultService,
    RetagService, RetagDefaultService, ProjectService, ProjectDefaultService
} from "../service/index";
import { VULNERABILITY_DIRECTIVES } from "../vulnerability-scanning/index";
import { FILTER_DIRECTIVES } from "../filter/index";
import { ChannelService } from "../channel/index";

import { CopyInputComponent } from "../push-image/copy-input.component";
import { LabelPieceComponent } from "../label-piece/label-piece.component";
import { LabelDefaultService, LabelService } from "../service/label.service";
import { UserPermissionService, UserPermissionDefaultService } from "../service/permission.service";
import { USERSTATICPERMISSION } from "../service/permission-static";
import { OperationService } from "../operation/operation.service";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

describe("TagComponent (inline template)", () => {

  let comp: TagComponent;
  let fixture: ComponentFixture<TagComponent>;
  let tagService: TagService;
  let userPermissionService: UserPermissionService;
  let spy: jasmine.Spy;
  let spyLabels: jasmine.Spy;
  let spyLabels1: jasmine.Spy;

  let mockTags: Tag[] = [
    {
      "digest": "sha256:e5c82328a509aeb7c18c1d7fb36633dc638fcf433f651bdcda59c1cc04d3ee55",
      "name": "1.11.5",
      "size": "2049",
      "architecture": "amd64",
      "os": "linux",
      "os.version": "",
      "docker_version": "1.12.3",
      "author": "NGINX Docker Maintainers \"docker-maint@nginx.com\"",
      "created": new Date("2016-11-08T22:41:15.912313785Z"),
      "signature": null,
      "labels": [],
    }
  ];

  let mockLabels: Label[] = [
    {
      color: "#9b0d54",
      creation_time: "",
      description: "",
      id: 1,
      name: "label0-g",
      project_id: 0,
      scope: "g",
      update_time: "",
    },
    {
      color: "#9b0d54",
      creation_time: "",
      description: "",
      id: 2,
      name: "label1-g",
      project_id: 0,
      scope: "g",
      update_time: "",
    }
  ];

  let mockLabels1: Label[] = [
    {
      color: "#9b0d54",
      creation_time: "",
      description: "",
      id: 1,
      name: "label0-g",
      project_id: 1,
      scope: "p",
      update_time: "",
    },
    {
      color: "#9b0d54",
      creation_time: "",
      description: "",
      id: 2,
      name: "label1-g",
      project_id: 1,
      scope: "p",
      update_time: "",
    }
  ];

  let config: IServiceConfig = {
    repositoryBaseEndpoint: "/api/repositories/testing"
  };
  let mockHasAddLabelImagePermission: boolean = true;
  let mockHasRetagImagePermission: boolean = true;
  let mockHasDeleteImagePermission: boolean = true;
  let mockHasScanImagePermission: boolean = true;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
      declarations: [
        TagComponent,
        LabelPieceComponent,
        ConfirmationDialogComponent,
        ImageNameInputComponent,
        VULNERABILITY_DIRECTIVES,
        FILTER_DIRECTIVES,
        CopyInputComponent
      ],
      providers: [
        ErrorHandler,
        ChannelService,
        { provide: SERVICE_CONFIG, useValue: config },
        { provide: TagService, useClass: TagDefaultService },
        { provide: ProjectService, useClass: ProjectDefaultService },
        { provide: RetagService, useClass: RetagDefaultService },
        { provide: ScanningResultService, useClass: ScanningResultDefaultService },
        { provide: LabelService, useClass: LabelDefaultService },
        { provide: UserPermissionService, useClass: UserPermissionDefaultService },
        { provide: OperationService }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagComponent);
    comp = fixture.componentInstance;

    comp.projectId = 1;
    comp.repoName = "library/nginx";
    comp.hasDeleteImagePermission = true;
    comp.hasScanImagePermission = true;
    comp.hasSignedIn = true;
    comp.registryUrl = "http://registry.testing.com";
    comp.withNotary = false;
    comp.withAdmiral = false;


    let labelService: LabelService;


    tagService = fixture.debugElement.injector.get(TagService);
    spy = spyOn(tagService, "getTags").and.returnValues(of(mockTags).pipe(delay(0)));
    userPermissionService = fixture.debugElement.injector.get(UserPermissionService);

    spyOn(userPermissionService, "getPermission")
    .withArgs(comp.projectId, USERSTATICPERMISSION.REPOSITORY_TAG_LABEL.KEY, USERSTATICPERMISSION.REPOSITORY_TAG_LABEL.VALUE.CREATE )
    .and.returnValue(of(mockHasAddLabelImagePermission))
     .withArgs(comp.projectId, USERSTATICPERMISSION.REPOSITORY.KEY, USERSTATICPERMISSION.REPOSITORY.VALUE.PULL )
     .and.returnValue(of(mockHasRetagImagePermission))
     .withArgs(comp.projectId, USERSTATICPERMISSION.REPOSITORY_TAG.KEY, USERSTATICPERMISSION.REPOSITORY_TAG.VALUE.DELETE )
     .and.returnValue(of(mockHasDeleteImagePermission))
     .withArgs(comp.projectId, USERSTATICPERMISSION.REPOSITORY_TAG_SCAN_JOB.KEY, USERSTATICPERMISSION.REPOSITORY_TAG_SCAN_JOB.VALUE.CREATE)
     .and.returnValue(of(mockHasScanImagePermission));

    labelService = fixture.debugElement.injector.get(LabelService);

    spyLabels = spyOn(labelService, "getGLabels").and.returnValues(of(mockLabels).pipe(delay(0)));
    spyLabels1 = spyOn(labelService, "getPLabels").withArgs(comp.projectId).and.returnValues(of(mockLabels1).pipe(delay(0)));

    fixture.detectChanges();
  });
  it("should load data", async(() => {
    expect(spy.calls.any).toBeTruthy();
  }));

  it("should load and render data", () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let de: DebugElement = fixture.debugElement.query(del => del.classes["datagrid-cell"]);
      fixture.detectChanges();
      expect(de).toBeTruthy();
      let el: HTMLElement = de.nativeElement;
      expect(el).toBeTruthy();
      expect(el.textContent.trim()).toEqual("1.11.5");
    });
  });

});


