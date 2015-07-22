#pragma strict

private var locating : boolean = true;

private var target : GameObject;

function OnTriggerStay(col : Collider)
{
	if(locating)
	{
		if(col.gameObject.tag == "Enemy")
		{
			transform.LookAt(col.gameObject.transform);
			gameObject.transform.parent.GetComponent("NPC").SendMessage("Attack", col.gameObject);
			locating = false;
		}
	}
}

function locateEnemy()
{
	locating = true;
}