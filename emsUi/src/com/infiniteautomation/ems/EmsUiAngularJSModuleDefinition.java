package com.infiniteautomation.ems;

import com.serotonin.m2m2.module.AngularJSModuleDefinition;

public class EmsUiAngularJSModule extends AngularJSModuleDefinition {
    @Override
    public String getJavaScriptFilename() {
        return "/angular/" + this.getModule().getName() + ".js";
    }
}
